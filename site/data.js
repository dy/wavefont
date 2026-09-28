/**
 * Facts the site draws, each with its source.
 */

/**
 * Render cost of one editor view of 1 hour of speech (155,039 bars), windowed, in ms of main thread through paint,
 * median of 5 runs, Apple M4 Max, Playwright headless (Chromium 145, WebKit 26, WebKit at the iPhone 13 viewport and
 * pixel ratio – not a phone): wavearea bench/render with wavefont 3.8.2 as plain values, a bar a character, centred
 * (values.window), and as values with shift marks, as wavearea encodes them (font.window), in one run (2026-09-27).
 * svg, html per bar and canvas per line are the same view drawn otherwise. paste is of 10 s of audio.
 */
export const bench = {
  ops: ['load', 'paste', 'gain', 'resize', 'select'],
  stacks: ['wavefont', 'wavefont marks', 'svg', 'html', 'canvas'],
  text: [true, true, false, false, false],
  browsers: {
    'chromium 145': [[5.1, 4.6, 7.1, 8.4, 0.86], [20, 18, 23, 26, 0.96], [6.7, 4.6, 9.1, 7.1, 0.81], [142, 102, 253, 395, 5.3], [3.2, 2.5, 3.7, 4.6, 0.87]],
    'webkit 26': [[12, 17, 16, 14, 12], [102, 106, 90, 276, 33], [11, 12, 15, 11, 5.5], [119, 111, 188, 420, 6.5], [4.6, 4.8, 8.3, 4.2, 2.2]],
    'iphone': [[3.1, 5.9, 4.2, 10, 5.6], [24, 28, 25, 80, 7.0], [8.5, 6.5, 8.1, 6.4, 8.5], [43, 38, 79, 119, 9.4], [7.9, 7.3, 3.7, 9.8, 8.3]]
  }
}

/** Commits per month to wavefont, wavearea and linefont together, August 2016 to September 2026: git log of each. */
export const commits = { from: [2016, 8], months: [39,9,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,53,26,26,6,11,0,0,2,0,0,0,0,0,0,1,0,0,0,0,14,34,143,82,100,40,0,0,46,36,9,76,3,0,1,2,1,0,0,20,2,1,0,2,6,0,0,2,0,0,0,0,0,0,0,0,0,2,9,1,0,17,2,0,2,50,0,5] }

/**
 * ॐ, U+0950, as Laila Bold draws it: its outline in font units, 1000 to the em, y down from the ink's top left. Laila,
 * Indian Type Foundry, 2014, SIL Open Font License 1.1 – fonts.google.com/specimen/Laila, the glyph as fontTools reads
 * it from Google Fonts' laila:wght@700.
 */
export const om = { w: 867, h: 921, d: 'M552 89Q552 121 533 140.5Q514 160 481 160Q448 160 420 132Q392 104 392 71Q392 38 410.5 19Q429 0 462 0Q495 0 523.5 28.5Q552 57 552 89ZM520 326Q427 326 355.5 279.5Q284 233 284 184Q284 155 312 140Q373 223 474 223Q521 223 562.5 200.5Q604 178 625 133Q651 135 673 156.5Q695 178 695 208Q695 263 638 294.5Q581 326 520 326ZM649 385Q732 385 799.5 470.5Q867 556 867 652Q867 748 815.5 811.5Q764 875 689 875Q648 875 621 850.5Q594 826 594 779Q668 779 711.5 717.5Q755 656 755 576Q755 545 741.5 520.5Q728 496 698 496Q668 496 647 532Q626 568 612.5 610.5Q599 653 565 689Q531 725 480 725Q457 725 438 717Q448 750 448 778Q448 839 405.5 880Q363 921 295.5 921Q228 921 172 893Q116 865 80 826.5Q44 788 22 750Q0 712 0 690Q0 654 42 641Q76 709 129.5 756.5Q183 804 250 804Q289 804 316 782.5Q343 761 343 722Q343 700 332.5 683Q322 666 313 662Q282 674 241 674Q200 674 165 653Q130 632 130 597Q130 562 152 545.5Q174 529 208 529Q242 529 271 542Q326 507 326 465Q326 441 307.5 429Q289 417 258 417Q227 417 189 430.5Q151 444 126 465Q85 438 85 396Q85 354 123.5 332Q162 310 211 310Q297 310 359 370Q421 430 421 515Q421 578 379 620Q398 631 422 631Q446 631 466 605.5Q486 580 499.5 544Q513 508 529 472Q545 436 575.5 410.5Q606 385 649 385Z' }
