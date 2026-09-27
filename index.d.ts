/** Max value a single wavefont char can encode (higher codepoints render blank). */
export declare const MAX: 127

/** Char for a single value 0–127 (clamped & rounded): U+0100–U+017F. */
export declare function char(value: number): string

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
