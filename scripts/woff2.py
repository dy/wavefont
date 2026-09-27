"""Web fonts: woff2 of each TTF without glyph names (post format 3) – browsers never read
them.

    python scripts/woff2.py OUT_DIR FONT.ttf [...]
"""
import os
import sys
from fontTools.ttLib import TTFont

out = sys.argv[1]
for path in sys.argv[2:]:
    font = TTFont(path)
    font['post'].formatType = 3.0
    font.flavor = 'woff2'
    dest = os.path.join(out, os.path.splitext(os.path.basename(path))[0] + '.woff2')
    font.save(dest)
    print(f'{path} → {dest} ({os.path.getsize(dest)} bytes)')
