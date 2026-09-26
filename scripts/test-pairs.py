"""Bars by range (scripts/pairs.py) render where they should, shaped with HarfBuzz:
- every U+F0000 | lo << 8 | hi (lo <= hi) has a glyph centered on 5 (lo + hi) - 140;
- variable font: at YELA 0 each equals the value hi - lo shifted by (lo + hi) / 2 - 64
  steps with the canonical marks, and heavy weights swap in the same clip twins.

    python scripts/test-pairs.py FONT.ttf [...]
"""
import sys
import uharfbuzz as hb

M = {'up': '́', 'down': '̀', 'up10': '̂', 'down10': '̌'}
bar = lambda lo, hi: chr(0xF0000 | lo << 8 | hi)
pairs = [(lo, hi) for lo in range(128) for hi in range(lo, 128)]


def shift(n):  # the JS package's canonical marks: 10-step first
    a, up = abs(n), n > 0
    return (M['up10'] if up else M['down10']) * (a // 10) + (M['up'] if up else M['down']) * (a % 10)


def ink(font, text):
    """Ink box (x0, y0, x1, y1) of shaped text, and its glyph ids."""
    b = hb.Buffer()
    b.add_str(text)
    b.guess_segment_properties()
    hb.shape(font, b)
    x, box = 0, None
    for i, p in zip(b.glyph_infos, b.glyph_positions):
        e = font.get_glyph_extents(i.codepoint)
        if e and e.width and e.height:
            x0, y1 = x + p.x_offset + e.x_bearing, p.y_offset + e.y_bearing
            r = (x0, y1 + e.height, x0 + e.width, y1)
            box = r if box is None else (min(box[0], r[0]), min(box[1], r[1]), max(box[2], r[2]), max(box[3], r[3]))
        x += p.x_advance
    return box, [i.codepoint for i in b.glyph_infos]


def check(path):
    face = hb.Face(hb.Blob.from_file_path(path))
    axes = {a.tag for a in face.axis_infos}
    locations = [{}]
    if axes:
        locations = [{'wght': w, 'ROND': r, 'YELA': y} for w, r, y in
                     ((100, 0, 0), (100, 100, -100), (400, 30, 100), (4, 0, 0), (1000, 100, -60))]
    fails = []
    for loc in locations:
        font = hb.Font(face)
        font.set_variations(loc)
        clips = 0
        for lo, hi in pairs:
            box, gids = ink(font, bar(lo, hi))
            nominal = font.get_nominal_glyph(0xF0000 | lo << 8 | hi)
            if not nominal or len(gids) != 1 or box is None:
                fails.append(f'{loc} {lo}..{hi}: no glyph')
                continue
            clips += gids[0] != nominal  # swapped by rvrn: glyph names may be stripped
            if abs((box[1] + box[3]) / 2 - (5 * (lo + hi) - 140)) > 0.5:
                fails.append(f'{loc} {lo}..{hi}: centered at {(box[1] + box[3]) / 2}')
            if loc.get('YELA') == 0 and (lo + hi) % 2 == 0:
                legacy, _ = ink(font, chr(0x100 + hi - lo) + shift((lo + hi) // 2 - 64))
                if box != legacy: fails.append(f'{loc} {lo}..{hi}: ink {box}, value + shift {legacy}')
        if loc.get('wght') == 1000 and clips != sum(hi - lo < 25 for lo, hi in pairs):
            fails.append(f'{loc}: {clips} clip twins shaped')
    print(f'{path}: {len(pairs)} bars × {len(locations)} locations, {len(fails)} failures')
    for f in fails[:10]: print('  ' + f)
    return not fails


if __name__ == '__main__':
    sys.exit(0 if all([check(p) for p in sys.argv[1:]]) else 1)
