"""Genera los 6 carruseles de 3 imágenes (1080x1350, 4:5) del pack MarkeWeed."""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from common import *

W, H = 1080, 1350
M = 90
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'contenido', 'MarkeWeed-Pack-Contenido', 'carruseles')

THEMES = {
    'navy':   dict(bg=NAVY,    fg=WHITE, sub=(205, 214, 224), acc=ORANGE300, acc2=TEAL300, logo='Blanco'),
    'navy9':  dict(bg=NAVY900, fg=WHITE, sub=(205, 214, 224), acc=ORANGE300, acc2=TEAL300, logo='Blanco'),
    'paper':  dict(bg=PAPER,   fg=NAVY,  sub=NAVY700,         acc=ORANGE,    acc2=TEAL,    logo='Navy'),
    'teal':   dict(bg=TEAL,    fg=WHITE, sub=WHITE,           acc=NAVY,      acc2=PAPER,   logo='Blanco'),
    'orange': dict(bg=ORANGE,  fg=WHITE, sub=WHITE,           acc=NAVY,      acc2=PAPER,   logo='Blanco'),
}


def fit(d, lines, fname, maxw, maxsize, tracking_ratio=-0.04):
    size = maxsize
    while size > 30:
        f = font(fname, size)
        if all(text_w(d, l.replace('*', ''), f, size * tracking_ratio) <= maxw for l in lines):
            return f, size * tracking_ratio
        size -= 2
    return font(fname, size), 0


def title(d, y, lines, th, maxsize=104, x=M, maxw=W - 2 * M, lh=1.08, anchor='l'):
    """Titular Rubik Mono One. Palabras entre *asteriscos* van en el color de acento."""
    f, tr = fit(d, lines, 'rubik', maxw, maxsize)
    for line in lines:
        parts = line.split('*')
        total = text_w(d, line.replace('*', ''), f, tr)
        cx = x - (total / 2 if anchor == 'm' else 0)
        for i, p in enumerate(parts):
            if not p:
                continue
            col = th['acc'] if i % 2 else th['fg']
            text(d, (cx, y), p, f, col, tracking=tr)
            cx += text_w(d, p, f, tr) + tr
        y += f.size * lh
    return y


def base(theme, n, seed):
    th = THEMES[theme]
    im = Image.new('RGBA', (W, H), th['bg'] + (255,))
    # blobs decorativos
    deco = {'navy': NAVY700, 'navy9': NAVY, 'paper': (232, 226, 213), 'teal': (0, 112, 112), 'orange': (184, 76, 0)}[theme]
    b = blob((760, 700), deco, seed=seed, rough=.25)
    im.alpha_composite(b, (W - 470, -260 + (seed % 3) * 40))
    b2 = blob((520, 480), deco, seed=seed + 7, rough=.3)
    im.alpha_composite(b2, (-260, H - 330))
    d = ImageDraw.Draw(im)
    # cabecera: contador de diapositiva
    text(d, (W - M, M + 6), f'{n}/3', font('unb', 24), th['fg'], tracking=3, anchor='rm')
    dim = tuple(int(a * .35 + b * .65) for a, b in zip(th['fg'], th['bg']))
    for i in range(3):
        x0 = W - M - 290 + 70 * i
        d.rounded_rectangle((x0, M, x0 + 56, M + 12), radius=6, fill=th['fg'] if i < n else dim)
    # pie: logo + usuario
    lg = logo(th['logo'], 230)
    im.alpha_composite(lg, (M, H - M - lg.height + 10))
    text(d, (W - M, H - M - 12), '@markeweed.es', font('sg-b', 28), th['fg'], anchor='rm')
    return im, d, th


def swipe(d, th, y=H - 250):
    text(d, (M, y), 'DESLIZA  →', font('unb', 24), th['acc2'] if th['bg'] != PAPER else TEAL, tracking=4)


def cta(d, th, y, label='HABLEMOS  ·  DM @MARKEWEED.ES'):
    bg = ORANGE if th['bg'] not in (ORANGE,) else NAVY
    w, h = chip(d, (M, y), label, WHITE, bg, size=28, pad=(38, 26))
    return y + h


def finish(im, path):
    im.alpha_composite(grain((W, H), 7, seed=hash(path) % 999))
    im.convert('RGB').save(path, 'PNG', optimize=True)


def emblem(d, cx, cy, r, ring, fill, ink):
    """Emblema del club ficticio «Tu Club»."""
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill, outline=ring, width=max(3, r // 14))
    d.ellipse((cx - r * .78, cy - r * .78, cx + r * .78, cy + r * .78), outline=ring, width=max(2, r // 30))
    d.text((cx, cy), 'TC', font=font('rubik', int(r * .62)), fill=ink, anchor='mm')


# ---------------------------------------------------------------- 01 Identidad
def c1(out):
    im, d, th = base('navy', 1, 1)
    chip(d, (M, 230), 'IDENTIDAD VISUAL', th['acc2'], th['bg'], size=24, outline=th['acc2'])
    y = title(d, 360, ['¿TU CLUB', 'SE RECONOCE', 'A LA *PRIMERA?*'], th, 104)
    paragraph(d, (M, y + 40), 'Si cada cartel, cada story y cada camiseta parecen de un sitio distinto, no es una marca: es ruido.', font('syne', 40), th['sub'], W - 2 * M - 40)
    swipe(d, th); finish(im, f'{out}/1.png')

    im, d, th = base('paper', 2, 2)
    y = title(d, 220, ['UN SISTEMA,', 'NO SOLO *UN LOGO*'], th, 80)
    # tarjetas del sistema
    cards = [(M, 470), (W / 2 + 15, 470), (M, 790), (W / 2 + 15, 790)]
    cw, ch = (W - 2 * M - 30) / 2, 290
    for (x, yy) in cards:
        d.rounded_rectangle((x, yy, x + cw, yy + ch), radius=34, fill=WHITE)
    lab = font('unb', 21)
    # 1 emblema
    x, yy = cards[0]; emblem(d, x + cw / 2, yy + 125, 82, NAVY, PAPER, NAVY)
    text(d, (x + cw / 2, yy + ch - 40), 'EMBLEMA', lab, NAVY, 3, 'mm')
    # 2 paleta
    x, yy = cards[1]
    for i, c in enumerate([NAVY, TEAL, ORANGE, PAPER]):
        cx = x + 62 + i * 82
        d.ellipse((cx - 34, yy + 92, cx + 34, yy + 160), fill=c, outline=(210, 205, 195), width=2)
    text(d, (x + cw / 2, yy + ch - 40), 'PALETA', lab, NAVY, 3, 'mm')
    # 3 tipografías
    x, yy = cards[2]
    d.text((x + cw * .3, yy + 120), 'A', font=font('rubik', 96), fill=NAVY, anchor='mm')
    d.text((x + cw * .68, yy + 120), 'Aa', font=font('syne-x', 96), fill=TEAL, anchor='mm')
    text(d, (x + cw / 2, yy + ch - 40), 'TIPOGRAFÍAS', lab, NAVY, 3, 'mm')
    # 4 manual
    x, yy = cards[3]
    for k in range(3):
        ox = x + 95 + k * 26; oy = yy + 46 + k * 14
        d.rounded_rectangle((ox, oy, ox + 150, oy + 160), radius=12, fill=[NAVY, TEAL, ORANGE][k])
    d.text((x + 95 + 52 + 75, yy + 46 + 28 + 80), 'MANUAL', font=font('unb', 18), fill=WHITE, anchor='mm')
    text(d, (x + cw / 2, yy + ch - 40), 'MANUAL DE MARCA', lab, NAVY, 3, 'mm')
    paragraph(d, (M, 1110), 'Logo, paleta, tipografías y reglas de uso.', font('sg', 34), NAVY700, W - 2 * M); finish(im, f'{out}/2.png')

    im, d, th = base('orange', 3, 3)
    y = title(d, 260, ['TODO', 'HABLA EL', 'MISMO', '*IDIOMA.*'], th, 120)
    y = paragraph(d, (M, y + 30), 'Identidad visual para clubs, asociaciones y growshops de Madrid. Imagen de marca, nunca publicidad.', font('syne', 40), WHITE, W - 2 * M - 40)
    cta(d, th, y + 50); finish(im, f'{out}/3.png')


# ---------------------------------------------------------------- 02 Perfiles
def phone_profile(im, x, y, w, messy):
    d = ImageDraw.Draw(im)
    h = w * 1.9
    d.rounded_rectangle((x, y, x + w, y + h), radius=w * .12, fill=NAVY900)
    sx, sy, sw = x + 18, y + 18, w - 36
    d.rounded_rectangle((sx, sy, sx + sw, y + h - 18), radius=w * .1, fill=WHITE)
    # avatar + bio
    cx, cy = sx + 70, sy + 110
    if messy:
        d.ellipse((cx - 44, cy - 44, cx + 44, cy + 44), fill=(170, 170, 170))
        for i, wd in enumerate([0.9, 0.55, 0.75]):
            d.rounded_rectangle((sx + 30, sy + 190 + i * 26, sx + 30 + (sw - 60) * wd, sy + 204 + i * 26), radius=6, fill=[(220, 80, 80), (120, 120, 120), (230, 180, 30)][i])
    else:
        emblem(d, cx, cy, 44, NAVY, PAPER, NAVY)
        d.text((cx + 64, cy - 14), 'tu_club', font=font('sg-b', 26), fill=NAVY, anchor='lm')
        d.text((cx + 64, cy + 18), 'Asociación · +18', font=font('sg', 20), fill=NAVY700, anchor='lm')
        for i, wd in enumerate([0.85, 0.6]):
            d.rounded_rectangle((sx + 30, sy + 190 + i * 26, sx + 30 + (sw - 60) * wd, sy + 202 + i * 26), radius=6, fill=(205, 212, 220))
    # destacados
    hy = sy + 290
    cols = [(200, 60, 140), (60, 180, 60), (240, 200, 0), (90, 90, 220)] if messy else [NAVY, TEAL, ORANGE, NAVY700]
    for i in range(4):
        hx = sx + 48 + i * (sw - 96) / 3
        d.ellipse((hx - 28, hy - 28, hx + 28, hy + 28), fill=cols[i] if messy else WHITE, outline=cols[i], width=5)
    # rejilla
    gy = hy + 60; g = (sw - 8) / 3
    pal_m = [(230, 60, 60), (40, 40, 40), (250, 210, 0), (90, 160, 240), (200, 60, 200), (130, 130, 130), (60, 200, 120), (240, 120, 30), (20, 20, 120)]
    pal_c = [NAVY, PAPER, TEAL, ORANGE, NAVY, PAPER, TEAL, NAVY700, ORANGE]
    for i in range(9):
        gx = sx + (i % 3) * (g + 4); gyy = gy + (i // 3) * (g + 4)
        if gyy + g > y + h - 24:
            break
        c = pal_m[i] if messy else pal_c[i]
        d.rectangle((gx, gyy, gx + g, gyy + g), fill=c)
        if not messy and c in (NAVY, TEAL, ORANGE):
            d.text((gx + g / 2, gyy + g / 2), 'TC', font=font('rubik', int(g * .3)), fill=WHITE if c != PAPER else NAVY, anchor='mm')


def c2(out):
    im, d, th = base('paper', 1, 4)
    chip(d, (M, 230), 'PERFILES DE REDES', TEAL, th['bg'], size=24, outline=TEAL)
    y = title(d, 360, ['TU PERFIL', 'HABLA ANTES', '*QUE TÚ.*'], th, 108)
    paragraph(d, (M, y + 40), 'Es lo primero que ve quien os busca. ¿Qué está diciendo ahora mismo de tu club?', font('syne', 40), th['sub'], W - 2 * M - 40)
    swipe(d, th); finish(im, f'{out}/1.png')

    im, d, th = base('navy', 2, 5)
    title(d, 210, ['ANTES  →  *DESPUÉS*'], th, 64)
    phone_profile(im, M + 10, 340, 400, True)
    phone_profile(im, W - M - 410, 340, 400, False)
    d = ImageDraw.Draw(im)
    chip(d, (M + 210, 1130), 'ANTES', WHITE, NAVY700, size=22, anchor='m')
    chip(d, (W - M - 210, 1130), 'DESPUÉS', WHITE, ORANGE, size=22, anchor='m')
    finish(im, f'{out}/2.png')

    im, d, th = base('teal', 3, 6)
    y = title(d, 230, ['LO QUE', '*REVISAMOS*'], th, 96)
    items = ['Bio clara, informativa y para mayores de edad', 'Destacados ordenados: agenda, normas y contacto',
             'Rejilla coherente con plantillas propias', 'Retiramos lo que sobra o no cumple']
    yy = y + 30
    for it in items:
        check_icon(d, M + 30, yy + 30, 30, WHITE, TEAL)
        yy = paragraph(d, (M + 90, yy + 6), it, font('syne', 36), WHITE, W - 2 * M - 100, 1.2) + 26
    cta(d, th, yy + 20); finish(im, f'{out}/3.png')


# ---------------------------------------------------------------- 03 Compromiso
def c3(out):
    im, d, th = base('navy9', 1, 7)
    chip(d, (M, 230), 'COMPROMISO LEGAL', th['acc'], th['bg'], size=24, outline=th['acc'])
    y = title(d, 360, ['LO QUE', 'NUNCA VERÁS', 'EN NUESTRO', '*TRABAJO.*'], th, 100)
    paragraph(d, (M, y + 40), 'Lo que no se puede mostrar, no lo mostramos. Y te lo decimos desde el primer día.', font('syne', 40), th['sub'], W - 2 * M - 40)
    swipe(d, th); finish(im, f'{out}/1.png')

    im, d, th = base('paper', 2, 8)
    y = title(d, 220, ['NUNCA', '*HACEMOS*'], th, 96)
    items = ['Publicidad ni anuncios del consumo o del local', 'Producto, humo ni consumo en imagen',
             'Precios, ofertas, promociones ni sorteos', 'Promesas de visibilidad o alcance', 'Publicar trabajos sin permiso del cliente']
    yy = y + 30
    for it in items:
        check_icon(d, M + 32, yy + 30, 32, ORANGE, WHITE, ok=False)
        yy = paragraph(d, (M + 92, yy + 6), it, font('syne', 40), NAVY, W - 2 * M - 100, 1.2) + 40
    finish(im, f'{out}/2.png')

    im, d, th = base('navy', 3, 9)
    y = title(d, 230, ['IMAGEN', 'DE MARCA.', '*NUNCA*', '*PUBLICIDAD.*'], th, 104)
    y = paragraph(d, (M, y + 26), 'Identidad, diseño, foto y vídeo de espacios, equipo y actividades. Comunicación informativa, discreta y para personas adultas.', font('syne', 34), th['sub'], W - 2 * M - 40)
    y = cta(d, th, y + 40)
    paragraph(d, (M, y + 26), 'Información orientativa; no constituye asesoramiento jurídico.', font('sg', 22), (170, 185, 200), W - 2 * M)
    finish(im, f'{out}/3.png')


# ---------------------------------------------------------------- 04 Proceso
def c4(out):
    im, d, th = base('teal', 1, 10)
    chip(d, (M, 230), 'CÓMO TRABAJAMOS', WHITE, th['bg'], size=24, outline=WHITE)
    y = title(d, 360, ['CINCO PASOS.', '*SIN*', '*SORPRESAS.*'], th, 112)
    fnum = font('rubik', 66)
    for i in range(5):
        cx = M + 40 + i * 190
        d.ellipse((cx - 70 + 30, y + 40, cx + 70 + 30, y + 180), outline=WHITE, width=4, fill=NAVY if i == 0 else None)
        d.text((cx + 30, y + 110), f'{i + 1}', font=fnum, fill=WHITE, anchor='mm')
    swipe(d, th); finish(im, f'{out}/1.png')

    im, d, th = base('paper', 2, 11)
    steps = [('Reunión en tu local', 'En persona y sin compromiso.'), ('Auditoría de imagen', 'Qué funciona, qué sobra, qué no cumple.'),
             ('Propuesta por escrito', 'Qué, en qué plazos y con qué presupuesto.'), ('Producción', 'Revisas cada pieza antes de darla por buena.'),
             ('Entrega', 'Archivos finales, guía de marca y accesos.')]
    yy = 210
    for i, (t, s) in enumerate(steps):
        d.rounded_rectangle((M, yy, W - M, yy + 168), radius=30, fill=WHITE)
        text(d, (M + 40, yy + 84), f'0{i + 1}', font('unb-b', 54), [TEAL, ORANGE][i % 2], 0, 'lm')
        d.text((M + 170, yy + 58), t, font=font('syne-x', 40), fill=NAVY, anchor='lm')
        d.text((M + 170, yy + 112), s, font=font('sg', 28), fill=NAVY700, anchor='lm')
        yy += 186
    finish(im, f'{out}/2.png')

    im, d, th = base('navy', 3, 12)
    y = title(d, 240, ['EL PRIMER', 'PASO ES', '*EN TU LOCAL.*'], th, 108)
    y = paragraph(d, (M, y + 30), 'Nos vemos en persona, conocemos el espacio y al equipo. Después, si te encaja, propuesta por escrito.', font('syne', 38), th['sub'], W - 2 * M - 40)
    cta(d, th, y + 50); finish(im, f'{out}/3.png')


# ---------------------------------------------------------------- 05 Merch
def merch_items(d, x, y, w, h, kind):
    d.rounded_rectangle((x, y, x + w, y + h), radius=34, fill=NAVY700)
    cx, cy = x + w / 2, y + h / 2 - 22
    if kind == 'camiseta':
        pts = [(cx - 70, cy - 95), (cx - 30, cy - 105), (cx, cy - 88), (cx + 30, cy - 105), (cx + 70, cy - 95), (cx + 120, cy - 45), (cx + 92, cy - 15), (cx + 70, cy - 32),
               (cx + 70, cy + 100), (cx - 70, cy + 100), (cx - 70, cy - 32), (cx - 92, cy - 15), (cx - 120, cy - 45)]
        d.polygon(pts, fill=PAPER); emblem(d, cx, cy + 10, 38, NAVY, PAPER, NAVY)
    elif kind == 'taza':
        d.rounded_rectangle((cx - 72, cy - 85, cx + 62, cy + 95), radius=18, fill=WHITE)
        d.rounded_rectangle((cx + 52, cy - 40, cx + 112, cy + 45), radius=30, outline=WHITE, width=16)
        d.rectangle((cx - 72, cy + 40, cx + 62, cy + 62), fill=ORANGE)
        emblem(d, cx - 5, cy - 18, 40, NAVY, WHITE, NAVY)
    elif kind == 'tarjeta':
        d.rounded_rectangle((cx - 135, cy - 85, cx + 135, cy + 85), radius=20, fill=TEAL)
        emblem(d, cx - 72, cy - 10, 44, WHITE, TEAL, WHITE)
        d.text((cx - 10, cy - 30), 'SOCIO', font=font('unb', 22), fill=WHITE, anchor='lm')
        d.text((cx - 10, cy + 8), 'Nº 0001', font=font('sg-b', 26), fill=WHITE, anchor='lm')
        d.rectangle((cx - 135, cy + 50, cx + 135, cy + 62), fill=NAVY)
    elif kind == 'pegatinas':
        emblem(d, cx - 50, cy - 30, 62, NAVY, ORANGE, WHITE)
        d.rounded_rectangle((cx + 5, cy + 5, cx + 125, cy + 85), radius=40, fill=PAPER)
        d.text((cx + 65, cy + 45), 'TU CLUB', font=font('unb-b', 20), fill=NAVY, anchor='mm')
        d.regular_polygon((cx - 70, cy + 70, 34), 6, fill=TEAL)
    lab = {'camiseta': 'CAMISETAS', 'taza': 'TAZAS', 'tarjeta': 'TARJETA DE SOCIO', 'pegatinas': 'PEGATINAS'}[kind]
    text(d, (cx, y + h - 46), lab, font('unb', 20), WHITE, 3, 'mm')


def c5(out):
    im, d, th = base('orange', 1, 13)
    chip(d, (M, 230), 'MERCHANDISING', WHITE, th['bg'], size=24, outline=WHITE)
    y = title(d, 360, ['TU MARCA,', 'EN TODO', 'LO QUE', '*TOCAS.*'], th, 116)
    paragraph(d, (M, y + 36), 'Piezas que el equipo y los socios quieren llevar.', font('syne', 40), WHITE, W - 2 * M - 40)
    swipe(d, th); finish(im, f'{out}/1.png')

    im, d, th = base('navy', 2, 14)
    title(d, 210, ['UNA *COLECCIÓN*'], th, 76)
    cw, chh = (W - 2 * M - 30) / 2, 400
    for i, k in enumerate(['camiseta', 'taza', 'tarjeta', 'pegatinas']):
        merch_items(d, M + (i % 2) * (cw + 30), 330 + (i // 2) * (chh + 30), cw, chh, k)
    finish(im, f'{out}/2.png')

    im, d, th = base('paper', 3, 15)
    y = title(d, 240, ['DISEÑADO', 'COMO', 'COLECCIÓN.', '*LISTO PARA*', '*IMPRENTA.*'], th, 108)
    y = paragraph(d, (M, y + 26), 'Textil, papelería, tarjetas de socio y packaging con la identidad de tu club.', font('syne', 36), NAVY700, W - 2 * M - 40)
    cta(d, th, y + 44); finish(im, f'{out}/3.png')


# ---------------------------------------------------------------- 06 Web por invitación
def lock(d, cx, cy, s, col, bg):
    d.rounded_rectangle((cx - s, cy - s * .2, cx + s, cy + s * 1.2), radius=s * .25, fill=col)
    d.arc((cx - s * .65, cy - s * 1.15, cx + s * .65, cy + s * .2), 180, 360, fill=col, width=int(s * .26))
    d.line([(cx - s * .65 + s * .13, cy - s * .48), (cx - s * .65 + s * .13, cy - s * .15)], fill=col, width=int(s * .26))
    d.line([(cx + s * .65 - s * .13, cy - s * .48), (cx + s * .65 - s * .13, cy - s * .15)], fill=col, width=int(s * .26))
    d.ellipse((cx - s * .18, cy + s * .3, cx + s * .18, cy + s * .66), fill=bg)


def c6(out):
    im, d, th = base('navy', 1, 16)
    chip(d, (M, 230), 'WEB POR INVITACIÓN', th['acc2'], th['bg'], size=24, outline=th['acc2'])
    y = title(d, 360, ['UNA WEB', 'QUE NO ESTÁ', 'ABIERTA', '*A CUALQUIERA.*'], th, 104)
    lock(d, W - M - 110, y + 120, 70, ORANGE300, NAVY)
    swipe(d, th); finish(im, f'{out}/1.png')

    im, d, th = base('paper', 2, 17)
    title(d, 210, ['ASÍ SE *ENTRA*'], th, 80)
    steps = [('01', 'Solicitas acceso', 'indicando el email de un socio.'), ('02', 'Un socio te avala', 'confirmándolo por email.'), ('03', 'Accedes', 'Sin aval, no se entra.')]
    yy = 360
    for i, (n, t, s) in enumerate(steps):
        d.rounded_rectangle((M, yy, W - M, yy + 190), radius=34, fill=WHITE)
        d.ellipse((M + 36, yy + 45, M + 136, yy + 145), fill=[TEAL, NAVY, ORANGE][i])
        d.text((M + 86, yy + 95), n, font=font('unb-b', 34), fill=WHITE, anchor='mm')
        d.text((M + 170, yy + 72), t, font=font('syne-x', 42), fill=NAVY, anchor='lm')
        d.text((M + 170, yy + 128), s, font=font('sg', 30), fill=NAVY700, anchor='lm')
        if i < 2:
            d.polygon([(W / 2 - 18, yy + 196), (W / 2 + 18, yy + 196), (W / 2, yy + 222)], fill=TEAL)
        yy += 230
    finish(im, f'{out}/2.png')

    im, d, th = base('teal', 3, 18)
    y = title(d, 240, ['PRIVADA', '*POR DISEÑO.*'], th, 110)
    yy = y + 30
    for it in ['Sin acceso abierto', 'Sin indexar en buscadores', 'Dominio a nombre de tu club', 'Con la identidad de tu marca']:
        check_icon(d, M + 30, yy + 26, 26, WHITE, TEAL)
        d.text((M + 80, yy + 26), it, font=font('syne', 38), fill=WHITE, anchor='lm')
        yy += 78
    cta(d, th, yy + 40); finish(im, f'{out}/3.png')


NAMES = ['01-identidad-visual', '02-perfil-de-redes', '03-compromiso-legal', '04-cinco-pasos', '05-merchandising', '06-web-por-invitacion']
if __name__ == '__main__':
    for name, fn in zip(NAMES, [c1, c2, c3, c4, c5, c6]):
        p = os.path.join(OUT, name); os.makedirs(p, exist_ok=True); fn(p); print('ok', name)
