#!/usr/bin/env python3
"""Genera la imatge de fons per al DMG d'instal·lació:
un rètol amb una fletxa que convida a arrossegar l'app a Aplicacions."""
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 660, 400
img = Image.new('RGB', (W, H), (255, 255, 255))
d = ImageDraw.Draw(img)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


# degradat rosa -> taronja (colors del joc)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=lerp((255, 107, 157), (255, 165, 0), t))

# taronja suau al centre per llegibilitat
overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
od.rounded_rectangle([20, 20, W - 20, H - 20], radius=28, fill=(255, 255, 255, 40))
img = Image.alpha_composite(img.convert('RGBA'), overlay)
d = ImageDraw.Draw(img)


def load_font(size):
    paths = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/System/Library/Fonts/SFNSDisplay.ttf',
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


title = load_font(30)
sub = load_font(20)

# títol
text = "Instal·la Aventura de Palabras"
tw = d.textlength(text, font=title)
d.text(((W - tw) / 2, 46), text, fill=(255, 255, 255), font=title)

# fletxa corbada que apunta de l'esquerra (app) a la dreta (Aplicacions)
try:
    d.arc([180, 170, 470, 300], 200, 340, fill=(255, 255, 255), width=8)
    # punta de la fletxa
    d.polygon([(452, 214), (486, 226), (452, 250)], fill=(255, 255, 255))
except Exception:
    pass

# text sota la fletxa
hint = "Arrossega la icona a la carpeta Aplicacions"
hw = d.textlength(hint, font=sub)
d.text(((W - hw) / 2, 320), hint, fill=(255, 255, 255), font=sub)

out = sys.argv[1] if len(sys.argv) > 1 else 'dmg-bg.png'
img.convert('RGB').save(out)
print('OK:', out)
