"""Trace a black-and-white bar image into vertical ink rectangles, for site/art-data.js.

The image is cut into horizontal slices (bands with their own pattern). In each slice, every
column's ink runs are matched to the previous column's (ends within `tol` px): a run that
continues extends its rectangle, a new one starts another. Rectangles are packed into lines
that don't overlap horizontally, so each line can be set as one line of Wavefont text.

    python scripts/trace.py IMAGE [--ink light] [--width 360] [--box x0,y0,x1,y1] [--slices y0,y1,...]

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


def pack(rects):
    lines = []
    for r in sorted(rects):
        for ln in lines:
            if ln[-1][0] + ln[-1][1] <= r[0]: ln.append(r); break
        else: lines.append([r])
    return lines


def trace(path, box=None, ink='dark', width=360, slices=None, thr=128, tol=2, min_w=1, min_h=1.5):
    im = Image.open(path).convert('L')
    if box: im = im.crop(box)
    k = width / im.size[0]
    height = round(im.size[1] * k)
    a = np.asarray(im.resize((width, height), Image.LANCZOS)).astype(float)
    m = a < thr if ink == 'dark' else a > thr
    cuts = [round(y * k) for y in (slices or [0, im.size[1]])]
    out = []
    for y0, y1 in zip(cuts, cuts[1:]):
        rs = [r for r in rectangles(m[y0:y1], tol) if r[1] >= min_w and r[3] - r[2] >= min_h]
        out.append(dict(y=y0, h=y1 - y0, lines=[[round(v) for r in ln for v in r] for ln in pack(rs)]))
    return dict(w=width, h=height, ink=ink, slices=out)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument('image')
    p.add_argument('--ink', choices=['dark', 'light'], default='dark', help='bars darker or lighter than the paper')
    p.add_argument('--width', type=int, default=360, help='trace at this width, px')
    p.add_argument('--box', help='crop x0,y0,x1,y1 in source px')
    p.add_argument('--slices', help='band edges y0,y1,... in source px, relative to the crop')
    p.add_argument('--thr', type=int, default=128, help='ink threshold, 0-255')
    a = p.parse_args()
    ints = lambda s: [int(v) for v in s.split(',')] if s else None
    print(json.dumps(trace(a.image, ints(a.box) and tuple(ints(a.box)), a.ink, a.width, ints(a.slices), a.thr), separators=(',', ':')))
