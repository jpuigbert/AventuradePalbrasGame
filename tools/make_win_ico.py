#!/usr/bin/env python3
"""Converteix un PNG en un .ico valid (format PNG-in-ICO, Vista+)."""
import struct
import sys

png_path, ico_path = sys.argv[1], sys.argv[2]
data = open(png_path, 'rb').read()

# Mides del PNG (IU: amplada bytes 16-19, alçada 20-23)
w, h = struct.unpack('>II', data[16:24])
we = 0 if w >= 256 else w   # 0 = 256 px en la capçalera ICO
he = 0 if h >= 256 else h

header = struct.pack('<HHH', 0, 1, 1)              # reservat, tipus=ico, 1 imatge
entry = struct.pack('<BBBBHHII', we, he, 0, 0, 1, 32, len(data), 6 + 16)
open(ico_path, 'wb').write(header + entry + data)
print(f'ICO creat: {ico_path} ({w}x{h}, {len(data)} bytes PNG)')
