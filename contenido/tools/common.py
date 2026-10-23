"""Utilidades comunes del pack de contenido MarkeWeed (marca, fuentes, dibujo)."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
F = os.path.join(ROOT, 'Brand', 'fonts')
LOGOS = os.path.join(ROOT, 'Brand', 'Logos', 'MarkeWeed Logos Sin Fondo')

NAVY = (0, 31, 63); TEAL = (0, 128, 128); ORANGE = (204, 85, 0)
WHITE = (255, 255, 255); BLACK = (0, 0, 0)
PAPER = (244, 241, 234); NAVY900 = (0, 18, 42); NAVY700 = (10, 49, 87)
TEAL300 = (63, 176, 176); ORANGE300 = (240, 138, 60)

_FONTS = {
    'rubik': 'Rubik_Mono_One/RubikMonoOne-Regular.ttf',
    'syne': 'Syne/static/Syne-Bold.ttf',
    'syne-x': 'Syne/static/Syne-ExtraBold.ttf',
    'syne-m': 'Syne/static/Syne-Medium.ttf',
    'unb': 'Unbounded/static/Unbounded-Bold.ttf',
    'unb-m': 'Unbounded/static/Unbounded-Medium.ttf',
    'unb-b': 'Unbounded/static/Unbounded-Black.ttf',
    'sg': 'Space_Grotesk/static/SpaceGrotesk-Medium.ttf',
    'sg-b': 'Space_Grotesk/static/SpaceGrotesk-Bold.ttf',
}
_cache = {}


def font(name, size):
    k = (name, int(size))
    if k not in _cache:
        _cache[k] = ImageFont.truetype(os.path.join(F, _FONTS[name]), int(size))
    return _cache[k]


_logo = {}


def logo(color='Blanco', width=600):
    """Logo PNG oficial recortado a su contenido y escalado al ancho pedido."""
    names = {'Navy': '01 · Navy (principal)', 'Teal': '02 · Teal', 'Naranja': '03 · Naranja',
             'Negro': '04 · Negro', 'Blanco': '05 · Blanco'}
    k = (color, width)
    if k not in _logo:
        im = Image.open(os.path.join(LOGOS, names[color] + '.png')).convert('RGBA')
        im = im.crop(im.getbbox())
        h = round(im.height * width / im.width)
        _logo[k] = im.resize((width, h), Image.LANCZOS)
    return _logo[k]


def text_w(d, s, f, tracking=0):
    w = d.textlength(s, font=f) + tracking * max(len(s) - 1, 0)
    if tracking:
        w -= d.textlength(' ', font=f) * .45 * s.count(' ')
    return w


def text(d, xy, s, f, fill, tracking=0, anchor='la'):
    """Texto con tracking opcional (anchor solo horizontal: l, m, r)."""
    x, y = xy
    if tracking == 0:
        d.text((x, y), s, font=f, fill=fill, anchor=anchor)
        return
    w = text_w(d, s, f, tracking)
    if anchor[0] == 'm':
        x -= w / 2
    elif anchor[0] == 'r':
        x -= w
    va = 'l' + anchor[1]
    for ch in s:
        if ch == ' ':
            x += d.textlength(' ', font=f) * .55 + tracking
            continue
        d.text((x, y), ch, font=f, fill=fill, anchor=va)
        x += d.textlength(ch, font=f) + tracking


def wrap(d, s, f, maxw):
    words, lines, cur = s.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=f) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def paragraph(d, xy, s, f, fill, maxw, lh=1.3, anchor='la'):
    x, y = xy
    for line in wrap(d, s, f, maxw):
        d.text((x, y), line, font=f, fill=fill, anchor=anchor)
        y += f.size * lh
    return y


def chip(d, xy, s, fg, bg, size=26, pad=(26, 14), outline=None, anchor='l'):
    f = font('unb', size)
    tw = text_w(d, s, f, 2)
    w, h = tw + pad[0] * 2, size + pad[1] * 2
    x, y = xy
    if anchor == 'm':
        x -= w / 2
    elif anchor == 'r':
        x -= w
    d.rounded_rectangle((x, y, x + w, y + h), radius=h / 2, fill=bg, outline=outline, width=3 if outline else 0)
    text(d, (x + pad[0], y + h / 2), s, f, fg, tracking=2, anchor='lm')
    return w, h


def grain(size, amount=10, seed=0):
    """Capa de grano RGBA para superponer (sutil)."""
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amount, (size[1], size[0])).clip(-40, 40)
    a = np.abs(n).astype(np.uint8)
    v = np.where(n > 0, 255, 0).astype(np.uint8)
    arr = np.dstack([v, v, v, a])
    return Image.fromarray(arr, 'RGBA')


def blob(size, color, seed=0, points=9, rough=0.22, alpha=255):
    """Forma orgánica (inspirada en el trazo del logo) como imagen RGBA."""
    rng = np.random.default_rng(seed)
    w, h = size
    cx, cy = w / 2, h / 2
    ang = np.linspace(0, 2 * np.pi, points, endpoint=False)
    r = 1 + rng.uniform(-rough, rough, points)
    # interpolación suave en polar
    t = np.linspace(0, 2 * np.pi, 360)
    rr = np.interp(t, np.concatenate([ang, [2 * np.pi]]), np.concatenate([r, [r[0]]]))
    k = np.ones(25) / 25
    rr = np.convolve(np.concatenate([rr[-25:], rr, rr[:25]]), k, 'same')[25:-25]
    pts = [(cx + np.cos(a) * rv * w * 0.45, cy + np.sin(a) * rv * h * 0.45) for a, rv in zip(t, rr)]
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    ImageDraw.Draw(im).polygon(pts, fill=color + (alpha,))
    return im


def check_icon(d, cx, cy, r, bg, fg, ok=True):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=bg)
    if ok:
        d.line([(cx - r * .45, cy + r * .02), (cx - r * .1, cy + r * .38), (cx + r * .48, cy - r * .35)], fill=fg, width=max(3, int(r * .22)), joint='curve')
    else:
        o = r * .38
        d.line([(cx - o, cy - o), (cx + o, cy + o)], fill=fg, width=max(3, int(r * .22)))
        d.line([(cx - o, cy + o), (cx + o, cy - o)], fill=fg, width=max(3, int(r * .22)))
