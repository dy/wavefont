"""Trace a black-and-white bar image into vertical ink rectangles, for site/art-data.js.

The image is cut into horizontal slices (bands with their own pattern). In each slice, every
column's ink runs are matched to the previous column's (ends within `tol` px): a run that
continues extends its rectangle, a new one starts another. Rectangles are packed into lines
that don't overlap horizontally, so each line can be set as one line of Wavefont text.

Edges are found at `sub` times the trace width, so a bar 2.5 px wide traces as 2.5, not 2 or 3;
with --even, bars drawn at one width and measured a little apart are set back to that width.
With --stripes, a picture that isn't made of bars is drawn with them: bars of equal width at a
fixed pitch, each spanning the ink it crosses.

    python scripts/trace.py IMAGE [--ink light] [--width 360] [--box x0,y0,x1,y1] [--slices y0,y1,...]
                                  [--sub 4] [--even] [--stripes PITCH [--fill 0.5]] [--fit]

prints {w, h, ink, slices: [{y, h, lines: [[x, width, top, bottom, ...]]}]} in pixels of the trace.
"""
import argparse, json
import numpy as np
from PIL import Image


def runs(col):
    d = np.diff(np.concatenate(([0], col.astype(np.int8), [0])))
    return list(zip(np.where(d == 1)[0], np.where(d == -1)[0]))


def rectangles(ink, tol):
    rects, open_ = [], []
    for x in range(ink.shape[1]):
        nxt = []
        for y0, y1 in runs(ink[:, x]):
            hit = next((r for r in open_ if abs(r['y0'] - y0) <= tol and abs(r['y1'] - y1) <= tol and r not in nxt), None)
            if hit: hit['x1'] = x + 1; hit['ys0'].append(y0); hit['ys1'].append(y1); nxt.append(hit)
            else:
                r = dict(x0=x, x1=x + 1, y0=y0, y1=y1, ys0=[y0], ys1=[y1]); rects.append(r); nxt.append(r)
        open_ = nxt
    return [(r['x0'], r['x1'] - r['x0'], float(np.median(r['ys0'])), float(np.median(r['ys1']))) for r in rects]


def stripes(ink, pitch, fill):
    """Bars of equal width every `pitch` px, each over the ink runs of the columns it covers."""
    w, rects = fill * pitch, []
    for k in range(int(ink.shape[1] // pitch)):
        a, b = round(k * pitch + (pitch - w) / 2), round(k * pitch + (pitch + w) / 2)
        for y0, y1 in runs(ink[:, a:max(b, a + 1)].any(axis=1)):
            rects.append((k * pitch + (pitch - w) / 2, w, float(y0), float(y1)))
    return rects


def even(rects, step=0.12):
    """Bars drawn at one width, measured a little apart, set back to one width: sorted widths form a group
    until one is more than `step` wider than the last, and each group snaps to its median, bars keeping their middles."""
    groups = []
    for w in sorted(r[1] for r in rects):
        if groups and w <= groups[-1][-1] * (1 + step): groups[-1].append(w)
        else: groups.append([w])
    snap = {w: g[len(g) // 2] for g in groups for w in g}
    return [(x + (w - snap[w]) / 2, snap[w], y0, y1) for x, w, y0, y1 in rects]


def pack(rects):
    lines = []
    for r in sorted(rects):
        for ln in lines:
            if ln[-1][0] + ln[-1][1] <= r[0] + 1e-9: ln.append(r); break
        else: lines.append([r])
    return lines


def trace(path, box=None, ink='dark', width=360, slices=None, thr=128, tol=2, min_w=1, min_h=1.5, sub=4, pitch=None, fill=0.5, fit=False, same=False):
    im = Image.open(path).convert('L')
    if box: im = im.crop(box)
    if fit:
        a = np.asarray(im)
        ys, xs = np.where(a < thr if ink == 'dark' else a > thr)
        im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    k = width / im.size[0]
    height = round(im.size[1] * k)
    # edges at 1/sub px: trace the picture sub times larger, then scale the rectangles back
    a = np.asarray(im.resize((width * sub, height * sub), Image.LANCZOS)).astype(float)
    m = a < thr if ink == 'dark' else a > thr
    cuts = [round(y * k) for y in (slices or [0, im.size[1]])]
    out = []
    for y0, y1 in zip(cuts, cuts[1:]):
        band = m[y0 * sub:y1 * sub]
        rs = stripes(band, pitch * sub, fill) if pitch else rectangles(band, tol * sub)
        rs = [tuple(v / sub for v in r) for r in rs]
        rs = [r for r in rs if r[1] >= min_w * (not pitch) and r[3] - r[2] >= min_h]
        if same: rs = even(rs)
        out.append(dict(y=y0, h=y1 - y0, lines=[[round(v, 2) for r in ln for v in r] for ln in pack(rs)]))
    return dict(w=width, h=height, ink=ink, slices=out)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument('image')
    p.add_argument('--ink', choices=['dark', 'light'], default='dark', help='bars darker or lighter than the paper')
    p.add_argument('--width', type=int, default=360, help='trace at this width, px')
    p.add_argument('--box', help='crop x0,y0,x1,y1 in source px')
    p.add_argument('--slices', help='band edges y0,y1,... in source px, relative to the crop')
    p.add_argument('--thr', type=int, default=128, help='ink threshold, 0-255')
    p.add_argument('--sub', type=int, default=4, help='edge precision: 1/sub px')
    p.add_argument('--stripes', type=float, help='draw with bars at this pitch, px of the trace')
    p.add_argument('--fill', type=float, default=0.5, help='with --stripes: bar width, a fraction of the pitch')
    p.add_argument('--fit', action='store_true', help='crop to the ink first')
    p.add_argument('--even', action='store_true', help='bars of about one width get exactly one width')
    a = p.parse_args()
    ints = lambda s: [int(v) for v in s.split(',')] if s else None
    print(json.dumps(trace(a.image, ints(a.box) and tuple(ints(a.box)), a.ink, a.width, ints(a.slices), a.thr,
                           sub=a.sub, pitch=a.stripes, fill=a.fill, fit=a.fit, same=a.even), separators=(',', ':')))
