#!/usr/bin/env python3
"""Genera els icones PWA amb qualitat (supermostratge 4x):
icons/icon-512.png, icons/icon-192.png, icons/favicon.ico
Disseny: quadrat arrodonit amb degradat rosa-taronja, llum suau,
arc de Sant Vicenç d'arcs nets amb ombra, llibre obert i espurnes."""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

SS = 4                      # factor de supermostratge
SIZE = 512 * SS             # llenç de treball (2048 px)
CORNER = 100 * SS

PINK = (255, 107, 157)
ORANGE = (255, 165, 0)
WHITE = (255, 255, 255, 255)


def px(v):
    return int(v * SS)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


# ---------------------------------------------------------------- fons degradat
base = Image.new('RGB', (SIZE, SIZE))
bd = ImageDraw.Draw(base)
step = 4 * SS
for y in range(SIZE):
    for x in range(0, SIZE, step):
        t = (x + y) / (2 * SIZE)
        bd.line([(x, y), (x + step - 1, y)], fill=lerp(PINK, ORANGE, t))

img = base.convert('RGBA')

# ------------------------------------------------------- llum radial superior
glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([px(-180), px(-260), px(520), px(260)], fill=(255, 255, 255, 90))
glow = glow.filter(ImageFilter.GaussianBlur(px(90)))
img = Image.alpha_composite(img, glow)

d = ImageDraw.Draw(img)


# ------------------------------------------------------- arc de Sant Vicenç
cx, cy = SIZE // 2, px(400)
# (radi, gruix, color) — bandes grosses i juntes perquè l'arc es vegi saturat
bands = [
    (px(200), px(44), WHITE),
    (px(156), px(44), (106, 187, 230, 255)),
    (px(112), px(44), (106, 201, 120, 255)),
    (px(68),  px(44), (255, 214, 79, 255)),
]


def draw_rainbow(dr, col_offset=(0, 0, 0, 0)):
    for idx, (r, w, col) in enumerate(bands):
        c = tuple(min(255, col[i] + col_offset[i]) for i in range(4))
        dr.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=c, width=w)


# ombra de l'arc
shade = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
sd = ImageDraw.Draw(shade)
for (r, w, _) in bands:
    sd.arc([cx - r, cy - r + px(10), cx + r, cy + r + px(10)],
           180, 360, fill=(60, 20, 40, 60), width=w)
img = Image.alpha_composite(img, shade.filter(ImageFilter.GaussianBlur(px(8))))
d = ImageDraw.Draw(img)

draw_rainbow(d)

# ------------------------------------------------------------- base verdilla
d.rounded_rectangle([cx - px(216), cy - px(4), cx + px(216), cy + px(34)],
                    radius=px(20), fill=(255, 255, 255, 210))

# ------------------------------------------------------------------- llibre
book_y = px(432)
bw, bh = px(150), px(86)
# ombra del llibre
d.rounded_rectangle([cx - bw + px(6), book_y - bh + px(12),
                     cx + bw + px(6), book_y + bh + px(12)],
                    radius=px(16), fill=(90, 30, 60, 60))
# tapes
d.polygon([(cx, book_y - bh + px(10)), (cx - bw, book_y - bh + px(26)),
           (cx - bw, book_y + bh), (cx, book_y + bh - px(14))],
          fill=(255, 255, 255, 250))
d.polygon([(cx, book_y - bh + px(10)), (cx + bw, book_y - bh + px(26)),
           (cx + bw, book_y + bh), (cx, book_y + bh - px(14))],
          fill=(245, 248, 255, 250))
# llomb
d.line([(cx, book_y - bh + px(10)), (cx, book_y + bh - px(14))],
       fill=(214, 160, 190, 255), width=px(5))
# ratlles de text
for i in range(3):
    y = book_y - bh + px(48) + i * px(22)
    d.line([(cx - bw + px(26), y), (cx - px(22), y - px(6))],
           fill=(180, 190, 215, 255), width=px(5))
    d.line([(cx + px(22), y - px(6)), (cx + bw - px(26), y)],
           fill=(180, 190, 215, 255), width=px(5))


# ----------------------------------------------------------------- espurnes
def sparkle(x, y, r, col=(255, 255, 255, 255)):
    pts = []
    for k in range(8):
        ang = -math.pi / 2 + k * math.pi / 4
        rad = r if k % 2 == 0 else r * 0.32
        pts.append((x + rad * math.cos(ang), y + rad * math.sin(ang)))
    d.polygon(pts, fill=col)


sparkle(px(104), px(118), px(38))
sparkle(px(412), px(96), px(30))
sparkle(px(352), px(196), px(17))
sparkle(px(64), px(300), px(15))
sparkle(px(452), px(296), px(20), (255, 240, 200, 255))

# ------------------------------------------------------------------ el dau
s = px(96)
dx, dy = px(196), px(56)
d.rounded_rectangle([dx, dy, dx + s, dy + s], radius=px(22),
                    fill=(255, 255, 255, 255), outline=(217, 78, 124, 255),
                    width=px(6))
pip = px(9)
for (fx, fy) in [(0.28, 0.28), (0.5, 0.5), (0.72, 0.72)]:
    d.ellipse([dx + s * fx - pip, dy + s * fy - pip,
               dx + s * fx + pip, dy + s * fy + pip], fill=PINK + (255,))

# ------------------------------------------- cantonades arrodonides + export
mask = Image.new('L', (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE, SIZE], radius=CORNER, fill=255)
final = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
final = Image.composite(img, final, mask)

os.makedirs('icons', exist_ok=True)
final.resize((512, 512), Image.LANCZOS).save('icons/icon-512.png')
final.resize((192, 192), Image.LANCZOS).save('icons/icon-192.png')
final.resize((64, 64), Image.LANCZOS).save(
    'icons/favicon.ico', sizes=[(64, 64), (32, 32), (16, 16)])
final.resize((1024, 1024), Image.LANCZOS).save('icons/icon-source.png')
print('OK: icon-512.png, icon-192.png, favicon.ico, icon-source.png')
