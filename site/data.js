/**
 * Facts the site draws, each with its source.
 */

/**
 * Render cost of one editor view of 1 hour of speech (155,039 bars), windowed, in ms of main thread through paint,
 * median of 5 runs, Apple M4 Max, Playwright headless (Chromium 145, WebKit 26, WebKit at the iPhone 13 viewport and
 * pixel ratio – not a phone): wavearea bench/render with wavefont 3.8.2 as plain values, a bar a character, centred
 * (values.window, 2026-09-27). svg, html per bar and canvas per line are the same view drawn otherwise.
 */
export const bench = {
  ops: ['load', 'paste 10 s', 'gain', 'resize', 'select'],
  stacks: ['wavefont', 'svg', 'html', 'canvas'],
  text: [true, false, false, false],
  browsers: {
    'chromium 145': [[5.1, 4.6, 7.1, 8.4, 0.86], [6.7, 4.6, 9.1, 7.1, 0.81], [142, 102, 253, 395, 5.3], [3.2, 2.5, 3.7, 4.6, 0.87]],
    'webkit 26': [[12, 17, 16, 14, 12], [11, 12, 15, 11, 5.5], [119, 111, 188, 420, 6.5], [4.6, 4.8, 8.3, 4.2, 2.2]],
    'iphone': [[3.1, 5.9, 4.2, 10, 5.6], [8.5, 6.5, 8.1, 6.4, 8.5], [43, 38, 79, 119, 9.4], [7.9, 7.3, 3.7, 9.8, 8.3]]
  }
}

/** Commits per month to wavefont, wavearea and linefont together, August 2016 to September 2026: git log of each. */
export const commits = { from: [2016, 8], months: [39,9,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,53,26,26,6,11,0,0,2,0,0,0,0,0,0,1,0,0,0,0,14,34,143,82,100,40,0,0,46,36,9,76,3,0,1,2,1,0,0,20,2,1,0,2,6,0,0,2,0,0,0,0,0,0,0,0,0,2,9,1,0,17,2,0,2,50,0,5] }
