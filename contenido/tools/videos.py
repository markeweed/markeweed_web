"""Genera los 2 vídeos motion graphic (1080x1920, 30 fps, ~15 s) con música ambiente y FX."""
import os, sys, math, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from common import *
import audio

W, H, FPS = 1080, 1920, 30
M = 96
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'contenido', 'MarkeWeed-Pack-Contenido', 'videos')
ONLY = sys.argv[2] if len(sys.argv) > 2 else None
GRAINS = [grain((W, H), 5, seed=0)]  # grano estático: textura sin disparar el peso del vídeo


# ------------------------------------------------------------ easing / tiempo
def clamp(x, a=0., b=1.): return max(a, min(b, x))
def prog(t, a, b): return clamp((t - a) / (b - a))
def out_cubic(p): return 1 - (1 - p) ** 3
def out_back(p, s=1.7): p -= 1; return 1 + p * p * ((s + 1) * p + s)
def in_cubic(p): return p ** 3
def inout(p): return 3 * p * p - 2 * p * p * p


# ------------------------------------------------------------ capas de texto
_layers = {}


def layer(s, fname, size, color, tracking=None):
    k = (s, fname, size, color, tracking)
    if k not in _layers:
        f = font(fname, size)
        tr = size * -.03 if tracking is None and fname == 'rubik' else (tracking or 0)
        tmp = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
        w = int(text_w(tmp, s, f, tr)) + 8
        asc, desc = f.getmetrics()
        im = Image.new('RGBA', (w, asc + desc + 8), (0, 0, 0, 0))
        text(ImageDraw.Draw(im), (2, 4), s, f, color, tracking=tr)
        _layers[k] = im
    return _layers[k]


def fit_size(lines, fname, maxw, maxsize):
    tmp = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    size = maxsize
    while size > 30:
        f = font(fname, size)
        if all(text_w(tmp, l, f, size * -.03 if fname == 'rubik' else 0) <= maxw for l in lines):
            return size
        size -= 2
    return size


def with_alpha(im, a):
    if a >= 1: return im
    im = im.copy(); al = im.getchannel('A').point(lambda v: int(v * a)); im.putalpha(al); return im


def rise(fr, lay, x, y, p, anchor='l'):
    """Revela una línea subiendo desde debajo de su caja (máscara)."""
    if p <= 0: return
    p = out_cubic(p)
    w, h = lay.size
    if anchor == 'm': x -= w / 2
    off = int((1 - p) * h)
    if h - off <= 0: return
    fr.alpha_composite(lay.crop((0, 0, w, h - off)), (int(x), int(y + off)))


def pop(fr, lay, cx, cy, p, alpha=1.):
    if p <= 0: return
    s = max(.01, out_back(clamp(p)))
    w, h = lay.size
    l2 = lay.resize((max(1, int(w * s)), max(1, int(h * s))), Image.BILINEAR) if abs(s - 1) > .01 else lay
    l2 = with_alpha(l2, clamp(p * 3) * alpha)
    fr.alpha_composite(l2, (int(cx - l2.width / 2), int(cy - l2.height / 2)))


def fade_in(fr, lay, x, y, p, dy=30):
    if p <= 0: return
    q = out_cubic(p)
    fr.alpha_composite(with_alpha(lay, q), (int(x), int(y + (1 - q) * dy)))


def title_block(fr, lines, t0, t, y, maxsize=150, color=WHITE, acc=ORANGE300, stagger=.18, lh=1.06, anchor='l', x=M):
    """Líneas en Rubik con *acento*; devuelve la y final."""
    size = fit_size([l.replace('*', '') for l in lines], 'rubik', W - 2 * M, maxsize)
    for i, l in enumerate(lines):
        col = acc if l.startswith('*') else color
        lay = layer(l.replace('*', ''), 'rubik', size, col)
        rise(fr, lay, W / 2 if anchor == 'm' else x, y, prog(t, t0 + i * stagger, t0 + i * stagger + .45), anchor)
        y += size * lh
    return y


def chip_layer(s, fg, bg, size=30, outline=None):
    k = ('chip', s, fg, bg, size, outline)
    if k not in _layers:
        f = font('unb', size)
        tmp = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
        w = int(text_w(tmp, s, f, 2) + 76); h = size + 52
        im = Image.new('RGBA', (w + 8, h + 8), (0, 0, 0, 0))
        chip(ImageDraw.Draw(im), (4, 4), s, fg, bg, size=size, pad=(38, 26), outline=outline)
        _layers[k] = im
    return _layers[k]


def bg(color, t, seed, deco):
    fr = Image.new('RGBA', (W, H), color + (255,))
    k = ('blob', seed, deco)
    if k not in _layers:
        _layers[k] = (blob((900, 820), deco, seed=seed, rough=.25), blob((700, 640), deco, seed=seed + 3, rough=.3))
    b1, b2 = _layers[k]
    fr.alpha_composite(b1, (int(W - 520 + 40 * math.sin(t * .7)), int(-300 + 30 * math.cos(t * .5))))
    fr.alpha_composite(b2, (int(-360 + 30 * math.cos(t * .6)), int(H - 520 + 40 * math.sin(t * .8))))
    return fr


def shake(fr, t, hits, amp=18, dur=.28):
    for h in hits:
        if 0 <= t - h < dur:
            k = (1 - (t - h) / dur) * amp
            dx, dy = int(math.sin(t * 91) * k), int(math.cos(t * 77) * k)
            out = Image.new('RGBA', (W, H), fr.getpixel((5, 5)))
            out.alpha_composite(fr, (dx, dy))
            return out
    return fr


def glitch(fr, t, strength=1.):
    a = np.array(fr)
    r = np.random.default_rng(int(t * 1000))
    for _ in range(int(6 * strength)):
        y0 = r.integers(0, H - 80); hh = r.integers(10, 80); dx = int(r.integers(-60, 60) * strength)
        a[y0:y0 + hh] = np.roll(a[y0:y0 + hh], dx, axis=1)
    a[..., 0] = np.roll(a[..., 0], int(10 * strength), axis=1)
    a[..., 2] = np.roll(a[..., 2], -int(10 * strength), axis=1)
    return Image.fromarray(a, 'RGBA')


def wipe(fr, p, color, direction='up'):
    if p <= 0 or p >= 2: return
    d = ImageDraw.Draw(fr)
    if p <= 1:
        top = H * (1 - inout(p)); d.rectangle((0, top, W, H), fill=color)
    else:
        bot = H * (1 - inout(p - 1)); d.rectangle((0, 0, W, bot), fill=color)


def emblem(d, cx, cy, r, ring, fill, ink, p=1.):
    if p <= 0: return
    if fill: d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)
    d.arc((cx - r, cy - r, cx + r, cy + r), -90, -90 + 360 * clamp(p * 1.4), fill=ring, width=max(4, r // 12))
    if p > .5:
        d.arc((cx - r * .78, cy - r * .78, cx + r * .78, cy + r * .78), 90, 90 + 360 * clamp((p - .5) * 2.5), fill=ring, width=max(2, r // 28))
    if p > .7:
        f = font('rubik', int(r * .62 * out_back(clamp((p - .7) * 3.3))) + 1)
        d.text((cx, cy), 'TC', font=f, fill=ink, anchor='mm')


def footer(fr, color='Blanco', alpha=1.):
    lg = logo(color, 200)
    fr.alpha_composite(with_alpha(lg, alpha), (M, H - 300))


def end_card(fr, t, bgc, title_lines, acc, cta_bg):
    """Logo + titular + CTA (cierre común)."""
    d = ImageDraw.Draw(fr)
    lg = logo('Blanco', 760)
    p = out_cubic(prog(t, 0, .7))
    if p > 0:
        w = int(lg.width * p)
        fr.alpha_composite(lg.crop((0, 0, max(1, w), lg.height)), (int((W - lg.width) / 2), 600))
        d.rectangle(((W - lg.width) / 2 + w, 590, (W - lg.width) / 2 + w + 10, 600 + lg.height + 10), fill=acc) if p < 1 else None
    y = title_block(fr, title_lines, .6, t, 900, 92, WHITE, acc, anchor='m', stagger=.2)
    pop(fr, chip_layer('HABLEMOS  ·  DM @MARKEWEED.ES', WHITE, cta_bg, 34), W / 2, y + 120, prog(t, 1.35, 1.75))
    fade_in(fr, layer('Estudio de imagen · Madrid', 'sg-b', 34, WHITE), W / 2 - layer('Estudio de imagen · Madrid', 'sg-b', 34, WHITE).width / 2, y + 230, prog(t, 1.7, 2.1))


# ============================================================ VÍDEO 1 · Identidad
def v1_frame(t):
    if t < 2.5:  # HOOK
        fr = bg(NAVY, t, 1, NAVY700)
        pop(fr, chip_layer('IDENTIDAD VISUAL', TEAL300, NAVY, 28, TEAL300), W / 2, 360, prog(t, .05, .4))
        pop(fr, layer('TU CLUB', 'rubik', 170, WHITE), W / 2, 640, prog(t, 0, .35))
        title_block(fr, ['¿TIENE', '*MARCA*', 'O SOLO', '*UN LOGO?*'], .45, t, 780, 140, WHITE, ORANGE300, .22, anchor='m')
        if t > 2.2:
            fr = glitch(fr, t, (t - 2.2) * 5)
        return shake(fr, t, [0.0, 1.11])
    if t < 5.3:  # ANTES
        lt = t - 2.5
        fr = bg(NAVY900, t, 4, NAVY)
        d = ImageDraw.Draw(fr)
        r = np.random.default_rng(3)
        pieces = [('TU CLUB', 'syne-x', 64), ('tuclub', 'sg', 58), ('TC', 'rubik', 90), ('Tu Club', 'syne-m', 70), ('T.CLUB', 'unb-b', 52), ('tu club', 'rubik', 44), ('TuClub', 'sg-b', 66)]
        cols = [(TEAL, WHITE), (PAPER, ORANGE), (ORANGE, NAVY), (WHITE, TEAL), (TEAL300, NAVY900), (NAVY700, ORANGE300), (ORANGE300, WHITE)]
        for i, (s, fn, sz) in enumerate(pieces):
            p = prog(lt, .08 * i, .08 * i + .35)
            if p <= 0: continue
            cx = [260, 760, 520, 300, 800, 480, 640][i] + r.uniform(-40, 40); cy = [560, 600, 760, 920, 930, 1080, 600][i] + r.uniform(-30, 30)
            ang = r.uniform(-24, 24) + 4 * math.sin(lt * 6 + i)
            card = Image.new('RGBA', (360, 230), cols[i][0] + (255,))
            cd = ImageDraw.Draw(card); cd.text((180, 115), s, font=font(fn, sz), fill=cols[i][1], anchor='mm')
            card = card.rotate(ang, expand=True, resample=Image.BICUBIC)
            pop(fr, card, cx + 12 * math.sin(lt * 9 + i), cy, p)
        pop(fr, chip_layer('ANTES', WHITE, NAVY700, 30), W / 2, 380, prog(lt, 0, .3))
        title_block(fr, ['CADA PIEZA', '*VA POR SU LADO.*'], .7, lt, 1250, 96, WHITE, ORANGE300, anchor='m')
        if int(lt * 5) % 3 == 0 and lt > .4:
            fr = glitch(fr, t, .7)
        wipe(fr, prog(lt, 2.45, 2.8) * 2, ORANGE)
        return fr
    if t < 9.7:  # DESPUÉS
        lt = t - 5.3
        fr = bg(PAPER, t, 6, (232, 226, 213))
        wipe(fr, 1 + prog(lt, 0, .35), ORANGE)
        d = ImageDraw.Draw(fr)
        pop(fr, chip_layer('DESPUÉS', WHITE, ORANGE, 30), W / 2, 380, prog(lt, .25, .55))
        emblem(d, W / 2, 640, 150, NAVY, WHITE, NAVY, prog(lt, .35, 1.2))
        for i, c in enumerate([NAVY, TEAL, ORANGE, NAVY700]):
            p = prog(lt, 1.1 + i * .1, 1.4 + i * .1)
            if p > 0:
                s = 54 * out_back(p); cx = W / 2 - 240 + i * 160
                d.ellipse((cx - s, 880 - s, cx + s, 880 + s), fill=c)
        # piezas alineadas
        items = ['PERFIL', 'CARTEL', 'TEXTIL', 'WEB']
        for i, s in enumerate(items):
            p = prog(lt, 1.6 + i * .12, 2.0 + i * .12)
            if p <= 0: continue
            card = Image.new('RGBA', (200, 250), (0, 0, 0, 0)); cd = ImageDraw.Draw(card)
            cd.rounded_rectangle((0, 0, 199, 249), radius=26, fill=[NAVY, TEAL, ORANGE, NAVY][i])
            emblem(cd, 100, 105, 54, WHITE, None, WHITE)
            text(cd, (100, 210), s, font('unb', 20), WHITE, 2, 'mm')
            fr.alpha_composite(with_alpha(card, clamp(p * 2)), (int(M + 12 + i * 228), int(1010 + (1 - out_cubic(p)) * 120)))
        title_block(fr, ['UN SISTEMA.', 'TODO HABLA', '*EL MISMO IDIOMA.*'], 2.3, lt, 1330, 96, NAVY, ORANGE, anchor='m', stagger=.2)
        return fr
    if t < 12.9:  # SERVICIOS
        lt = t - 9.7
        fr = bg(NAVY, t, 9, NAVY700)
        d = ImageDraw.Draw(fr)
        rise(fr, layer('LO QUE HACEMOS', 'unb', 34, TEAL300, 4), W / 2, 380, prog(lt, 0, .3), 'm')
        sv = [('IDENTIDAD', 'VISUAL'), ('PERFILES', 'DE REDES'), ('FOTO', 'Y VÍDEO'), ('WEB POR', 'INVITACIÓN'), ('MERCHAN-', 'DISING')]
        i = min(4, int(lt / .62)); st = lt - i * .62
        size = fit_size([a for a in sum(sv, ())], 'rubik', W - 2 * M, 118)
        num = layer(f'0{i + 1}', 'unb-b', 260, ORANGE300)
        pop(fr, num, W / 2, 760, prog(st, 0, .25))
        rise(fr, layer(sv[i][0], 'rubik', size, WHITE), W / 2, 960, prog(st, .04, .3), 'm')
        rise(fr, layer(sv[i][1], 'rubik', size, WHITE), W / 2, 960 + size * 1.1, prog(st, .1, .36), 'm')
        for k in range(5):
            x0 = W / 2 - 250 + k * 104
            d.rounded_rectangle((x0, 1380, x0 + 84, 1394), radius=7, fill=ORANGE300 if k <= i else NAVY700)
        if lt > 3.0:
            wipe(fr, prog(lt, 3.0, 3.2), ORANGE)
        return fr
    lt = t - 12.9  # CIERRE
    fr = bg(ORANGE, t, 12, (184, 76, 0))
    end_card(fr, lt, ORANGE, ['IMAGEN DE MARCA,', '*NUNCA PUBLICIDAD.*'], NAVY, NAVY)
    return fr


V1_EVENTS = [(0, 'impact'), (.05, 'pop_lo'), (.45, 'pop'), (.67, 'pop'), (.89, 'pop'), (1.11, 'impact', .8), (2.2, 'glitch'), (2.35, 'whoosh'),
             *[(2.5 + .08 * i, 'pop_lo', .7) for i in range(7)], (3.3, 'glitch', .8), (4.0, 'glitch', .6), (4.85, 'riser', .7), (4.95, 'whoosh'), (5.55, 'whoosh_down'),
             (5.65, 'shimmer'), *[(6.4 + i * .1, 'pop_hi', .7) for i in range(4)], *[(6.9 + i * .12, 'pop', .6) for i in range(4)], (7.6, 'whoosh', .6),
             *[(9.7 + i * .62, 'pop_lo') for i in range(5)], *[(9.74 + i * .62, 'whoosh', .5) for i in range(5)], (12.3, 'riser'), (12.7, 'whoosh'),
             (12.9, 'impact', .8), (13.0, 'shimmer'), (14.25, 'pop')]


# ============================================================ VÍDEO 2 · Checklist
CHECKS = [('BIO CLARA', 'E INFORMATIVA', 'Para mayores de edad, sin reclamos.'), ('SIN PRECIOS', 'NI OFERTAS', 'Ni promociones ni sorteos.'),
          ('SIN PRODUCTO', 'NI HUMO', 'Espacios, equipo y actividades.'), ('DESTACADOS', 'ORDENADOS', 'Agenda, normas y contacto.'),
          ('REJILLA', 'COHERENTE', 'Plantillas con tu identidad.')]
STEP = 1.65; C0 = 2.5


def v2_frame(t):
    if t < C0:  # HOOK
        fr = bg(NAVY, t, 21, NAVY700)
        d = ImageDraw.Draw(fr)
        # temporizador
        p = prog(t, .1, C0)
        d.arc((W / 2 - 90, 330, W / 2 + 90, 510), -90, -90 + 360 * (1 - p), fill=ORANGE300, width=14)
        d.text((W / 2, 420), '5', font=font('unb-b', 84), fill=WHITE, anchor='mm')
        s1 = fit_size(['¿TU PERFIL'], 'rubik', W - 2 * M, 150); s2 = fit_size(['CUMPLE?'], 'rubik', W - 2 * M, 190)
        pop(fr, layer('¿TU PERFIL', 'rubik', s1, WHITE), W / 2, 720, prog(t, 0, .35))
        pop(fr, layer('CUMPLE?', 'rubik', s2, ORANGE300), W / 2, 880, prog(t, .35, .7))
        fade_in(fr, layer('Compruébalo en 5 puntos', 'syne', 52, WHITE), W / 2 - layer('Compruébalo en 5 puntos', 'syne', 52, WHITE).width / 2, 1060, prog(t, .9, 1.3))
        fade_in(fr, layer('Quédate hasta el final  →', 'unb', 28, TEAL300, 3), W / 2 - layer('Quédate hasta el final  →', 'unb', 28, TEAL300, 3).width / 2, 1180, prog(t, 1.3, 1.6))
        wipe(fr, prog(t, 2.15, 2.5), PAPER)
        return shake(fr, t, [0, .35])
    if t < C0 + STEP * 5 + .2:  # CHECKLIST
        lt = t - C0
        fr = bg(PAPER, t, 23, (232, 226, 213))
        d = ImageDraw.Draw(fr)
        i = min(4, int(lt / STEP)); st = lt - i * STEP
        text(d, (M, 330), 'CHECKLIST DE PERFIL', font('unb', 28), TEAL, 3)
        text(d, (W - M, 330), f'{i + 1}/5', font('unb', 28), NAVY, 3, 'ra')
        for k in range(5):
            x0 = M + k * ((W - 2 * M) / 5)
            fill = ORANGE if k < i or (k == i and st > .75) else (214, 208, 196)
            d.rounded_rectangle((x0, 392, x0 + (W - 2 * M) / 5 - 14, 406), radius=7, fill=fill)
        a, b, sub = CHECKS[i]
        pop(fr, layer(f'0{i + 1}', 'unb-b', 220, TEAL), M + 165, 700, prog(st, 0, .25))
        size = fit_size([x for c in CHECKS for x in c[:2]], 'rubik', W - 2 * M, 112)
        rise(fr, layer(a, 'rubik', size, NAVY), M, 880, prog(st, .05, .35))
        rise(fr, layer(b, 'rubik', size, ORANGE), M, 880 + size * 1.1, prog(st, .12, .42))
        fade_in(fr, layer(sub, 'syne', 48, NAVY700), M, 915 + size * 2.3, prog(st, .3, .6))
        # check grande
        p = prog(st, .7, 1.0)
        if p > 0:
            cx, cy, r = W - M - 110, 700, 100 * out_back(p)
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=TEAL)
            q = prog(st, .8, 1.05)
            pts = [(cx - 42, cy + 2), (cx - 10, cy + 36), (cx + 46, cy - 32)]
            if q > 0:
                seg = q * 2
                end1 = pts[1] if seg >= 1 else (pts[0][0] + (pts[1][0] - pts[0][0]) * seg, pts[0][1] + (pts[1][1] - pts[0][1]) * seg)
                d.line([pts[0], end1], fill=WHITE, width=18)
                if seg > 1:
                    s2 = seg - 1
                    d.line([pts[1], (pts[1][0] + (pts[2][0] - pts[1][0]) * s2, pts[1][1] + (pts[2][1] - pts[1][1]) * s2)], fill=WHITE, width=18, joint='curve')
        # lista acumulada
        y0 = 1230
        for k in range(i + (1 if st > 1.0 else 0)):
            yy = y0 + k * 64
            check_icon(d, M + 24, yy + 24, 24, TEAL, WHITE)
            d.text((M + 68, yy + 24), f'{CHECKS[k][0].capitalize()} {CHECKS[k][1].lower()}', font=font('syne', 34), fill=NAVY, anchor='lm')
        if lt > STEP * 5 - .1:
            wipe(fr, prog(lt, STEP * 5 - .1, STEP * 5 + .2), NAVY)
        return fr
    if t < 13.1:  # GIRO
        lt = t - (C0 + STEP * 5 + .2)
        fr = bg(NAVY, t, 25, NAVY700)
        title_block(fr, ['¿FALLA', '*ALGUNO?*'], 0, lt, 640, 170, WHITE, ORANGE300, anchor='m', stagger=.2)
        if lt > .8:
            y = title_block(fr, ['LO', '*ORDENAMOS.*'], .95, lt, 1020, 150, WHITE, TEAL300, anchor='m', stagger=.2)
            fade_in(fr, layer('Auditoría y limpieza de perfiles', 'syne', 46, WHITE), W / 2 - layer('Auditoría y limpieza de perfiles', 'syne', 46, WHITE).width / 2, y + 40, prog(lt, 1.4, 1.8))
        if .7 < lt < .95:
            fr = glitch(fr, t, 1.4)
        return shake(fr, t, [C0 + STEP * 5 + .2, C0 + STEP * 5 + 1.15])
    lt = t - 13.1  # CIERRE
    fr = bg(NAVY900, t, 27, NAVY)
    end_card(fr, lt, NAVY900, ['UN PERFIL LIMPIO', '*SE NOTA.*'], ORANGE300, ORANGE)
    return fr


_e = []
for i in range(5):
    s = C0 + i * STEP
    _e += [(s, 'pop_lo'), (s + .05, 'whoosh', .5), (s + .7, 'pop', .6), (s + .82, 'tick')]
V2_EVENTS = [(0, 'impact'), (.35, 'impact', .7), (.9, 'pop'), (2.15, 'whoosh'), *_e, (C0 + STEP * 5 - .4, 'riser', .6), (C0 + STEP * 5 - .05, 'whoosh'),
             (C0 + STEP * 5 + .2, 'impact', .8), (C0 + STEP * 5 + .9, 'glitch'), (C0 + STEP * 5 + 1.15, 'impact', .7), (12.6, 'riser', .7),
             (13.1, 'whoosh_down'), (13.15, 'shimmer'), (14.45, 'pop')]


def build(name, frame_fn, dur, events, chords, bpm):
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp()
    wav = os.path.join(tmp, 'a.wav')
    audio.render(wav, dur, chords, events, bpm)
    mp4 = os.path.join(OUT, name + '.mp4')
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-i', wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                          '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', mp4], stdin=subprocess.PIPE)
    n = int(dur * FPS)
    for f in range(n):
        fr = frame_fn(f / FPS)
        fr.alpha_composite(GRAINS[0])
        p.stdin.write(fr.convert('RGB').tobytes())
        if f == int(1.6 * FPS):
            fr.convert('RGB').save(os.path.join(OUT, name + '-portada.png'))
    p.stdin.close(); p.wait()
    print('ok', mp4)


if __name__ == '__main__':
    if ONLY in (None, '1'):
        build('01-reel-identidad-antes-despues', v1_frame, 15.5, V1_EVENTS, [[57, 64, 67, 71, 74], [53, 60, 64, 67, 72], [48, 55, 59, 64, 67], [55, 62, 66, 69, 74]], 92)
    if ONLY in (None, '2'):
        build('02-reel-checklist-perfil', v2_frame, 15.6, V2_EVENTS, [[50, 57, 60, 64, 69], [46, 53, 57, 62, 65], [53, 60, 64, 67, 72], [48, 55, 60, 62, 67]], 96)
