"""Bars by range: one glyph per bar spanning levels lo..hi, at U+F0000 | lo << 8 | hi.

Each is a composite of the value bar hi - lo (0 shows the thinnest bar, as U+0100 does),
raised to center on y = 5 (lo + hi) - 140: the value hi - lo shifted by (lo + hi) / 2 - 64
steps with centered bars (YELA 0) – level 64 is the middle of the line. The range ignores
YELA: in a variable font the components are the bars pinned at the default alignment
(added as `.mid`, other axes kept), so every offset is constant. Alignment only moves a
bar, and at its default every alignment delta scales to zero: the pin is exact. No combining marks and no layout
rules: shapers take the glyph from cmap, so text lays out like plain text (WebKit leaves
its complex text path). At heavy weights the clip twin of each bar is swapped in by the
same conditions (rvrn).

    python scripts/pairs.py FONT.ttf [...]   # in place, TrueType outlines
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable
from fontTools.pens.boundsPen import BoundsPen
from fontTools.varLib.instancer import instantiateVariableFont

BASE, LEVELS = 0xF0000, 128
center = lambda lo, hi: 5 * (lo + hi) - 140  # font units
USE_MY_METRICS = 0x0200


def centers(font, names, **axes):
    """Vertical middle of each glyph's ink – still where round caps overhang a short bar –
    at a normalized location of a variable font (default axes otherwise)."""
    gs = font.getGlyphSet(location=axes or None, normalized=True)
    out = {}
    for n in names:
        p = BoundsPen(gs)
        gs[n].draw(p)
        out[n] = (p.bounds[1] + p.bounds[3]) / 2
    return out


def composite(base, dy):
    c = GlyphComponent()
    c.glyphName, c.x, c.y, c.flags = base, 0, dy, USE_MY_METRICS
    g = Glyph()
    g.numberOfContours, g.components = -1, [c]
    return g


def pairs(path):
    font = TTFont(path)
    font.ensureDecompiled()  # gvar and HVAR index glyphs by order: read before it grows
    cmap = font.getBestCmap()
    value = {v: cmap[0x100 + v] for v in range(LEVELS)}
    variable = 'gvar' in font
    clips = {}  # bar → its clip twin, and the rvrn lookups that swap it
    if variable and getattr(font['GSUB'].table, 'FeatureVariations', None):
        subs = font['GSUB'].table.LookupList.Lookup
        for rec in font['GSUB'].table.FeatureVariations.FeatureVariationRecord:
            for sub in rec.FeatureTableSubstitution.SubstitutionRecord:
                for i in sub.Feature.LookupListIndex:
                    for st in subs[i].SubTable:
                        for a, b in st.mapping.items():
                            clips.setdefault(a, (b, []))[1].append(st)

    bars = sorted(set(value.values()) | {b for b, _ in clips.values()})
    glyf, hmtx = font['glyf'], font['hmtx']
    hvar = variable and font['HVAR'].table.AdvWidthMap
    part = {b: b for b in bars}  # component drawing each bar
    if variable:  # bars pinned at the default alignment, other axes kept exactly
        yela = next(a for a in font['fvar'].axes if a.axisTag == 'YELA')
        pinned = instantiateVariableFont(TTFont(path), {'YELA': yela.defaultValue}, optimize=False)
        for b in bars:
            part[b] = f'{b}.mid'
            glyf[part[b]] = pinned['glyf'][b]
            font['gvar'].variations[part[b]] = pinned['gvar'].variations.get(b, [])
            hmtx[part[b]] = hmtx[b]
            hvar.mapping[part[b]] = hvar.mapping[b]
    mid = centers(font, part.values())
    for axis in font['fvar'].axes if variable else ():
        for end in (-1.0, 1.0):
            moved = centers(font, part.values(), **{axis.axisTag: end})
            assert all(abs(moved[n] - mid[n]) < 1 for n in part.values()), f'{axis.axisTag} moves bars'
    mapped, twins = {}, []

    def add(name, bar, lo, hi):
        base = part[bar]
        glyf[name] = composite(base, round(center(lo, hi) - mid[base]))  # appends to the glyph order
        hmtx[name] = hmtx[base]
        if hvar: hvar.mapping[name] = hvar.mapping[base]

    for lo in range(LEVELS):
        for hi in range(lo, LEVELS):
            bar = value[hi - lo] if hi > lo else value[1]
            name = f'r{lo}_{hi}'
            add(name, bar, lo, hi)
            mapped[BASE | lo << 8 | hi] = name
            if bar in clips: twins.append((name, bar, lo, hi))
    for name, bar, lo, hi in twins:  # clip twins after all pairs: cmap stays one run per row
        clip, lookups = clips[bar]
        add(f'{name}.clip', clip, lo, hi)
        for st in lookups: st.mapping[name] = f'{name}.clip'
    font.setGlyphOrder(glyf.glyphOrder)

    # full-repertoire Unicode subtables, so no BMP-only one shadows the range
    full = {**cmap, **mapped}
    font['cmap'].tables = [s for s in font['cmap'].tables if s.format != 12]
    for platform, encoding in ((0, 4), (3, 10)):
        t = CmapSubtable.newSubtable(12)
        t.platformID, t.platEncID, t.language, t.cmap = platform, encoding, 0, full
        font['cmap'].tables.append(t)
    font['cmap'].tables.sort(key=lambda s: (s.platformID, s.platEncID))
    font.save(path)
    return len(mapped), len(twins)


if __name__ == '__main__':
    for p in sys.argv[1:]:
        n, c = pairs(p)
        print(f'{p}: {n} range bars, {c} clip twins')
