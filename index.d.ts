/** Max value a single wavefont char can encode (higher codepoints render blank). */
export declare const MAX: 127

/** Char for a single value 0–127 (clamped & rounded): U+0100–U+017F. */
export declare function char(value: number): string

/**
 * Char for a bar spanning levels lo..hi (0–127 each, clamped & rounded, either order):
 * U+F0000 | lo << 8 | hi – one precomposed glyph, no combining marks. Level 64 is the
 * middle of the line; YELA does not apply. One code point, two UTF-16 units.
 */
export declare function bar(lo: number, hi: number): string

/** Wavefont string of bars spanning lo[i]..hi[i], levels 0–127. */
export declare function bars(lo: ArrayLike<number>, hi: ArrayLike<number>): string

/**
 * Combining marks shifting the preceding bar by ±steps (−100..100, clamped & rounded).
 * Emits the canonical order the font recognizes: 10-step marks first, then 1-step marks
 * (up: U+0302 then U+0301, down: U+030C then U+0300).
 */
export declare function shift(steps: number): string

/** Wavefont string for values 0–127 (each clamped & rounded). */
declare function wavefont(values: ArrayLike<number>): string
declare function wavefont(...values: number[]): string
export default wavefont
