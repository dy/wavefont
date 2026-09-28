/**
 * Voice Memos, fitted to the screen: record, pause, listen back while paused, drag the waveform to scrub, save.
 * The waveform is text set in Wavefont, one bar per 1/23.7 s as Voice Memos draws it.
 */
import wf from '../index.js'
import { play, wav } from './sound.js'
import { listen, micError, mark, weight } from './wave.js'
import { $, h } from './dom.js'

const RATE = 23.7, dt = 1 / RATE

const two = n => String(Math.floor(n)).padStart(2, '0')
const stamp = s => `${two(s / 60)}:${two(s % 60)}.${two(s % 1 * 100)}`
const short = s => `${two(s / 60)}:${two(s % 60)}`
const text = lv => wf(Array.from(lv, v => Math.max(3, v * 100)))
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/**
 * The tape's clock while recording, s: the wall's speed from when the audio began, never past the audio. A microphone
 * starts late and its chunks come unevenly, some a burst at once: each chunk – t seconds of audio in by `now`, ms –
 * says when the audio would have begun had it come at once. The earliest of those is when it did, and the clock keeps
 * as far behind as a chunk has come late, and a chunk more: so it runs on between chunks without running out.
 * -Infinity till one comes; again() for audio picking up after a pause, the wall having moved on.
 */
export const clock = () => {
  let got = 0, early = Infinity, late = 0
  return {
    hear(t, now) { const at = now - t * 1000; early = Math.min(early, at), late = Math.max(late, at - early + (t - got) * 1000), got = t },
    at: now => Math.min(got, (now - early - late) / 1000),
    again() { early = Infinity, late = 0 }
  }
}

export function memo() {
  const vm = $('.vm'), wave = $('.vm-wave'), tape = $('.vm-bars'), scale = $('.vm-scale'), time = $('.vm-time')
  const title = $('.vm-title'), date = $('.vm-date'), len = $('.vm-len'), note = $('.vm-note')
  const playBtn = $('.vm-play'), back = $('.vm-back'), fwd = $('.vm-fwd'), rec = $('.vm-rec'), done = $('.vm-done')
  const heard = new Range()
  // clip: the audio to play – the finished recording, or what's recorded so far while paused
  let state = 'idle', lv = [], clip = null, recorder = null, starting = false, handle = null, raf = 0
  let pos = 0, pitch = 4, ruled = '', drag = null, clk = clock()

  const length = () => lv.length * dt
  const pps = () => pitch * RATE
  // while recording, the tape runs on its clock, never back; a bar is written as the playhead reaches its time: the
  // newest stands at the playhead, and a pause holds it there
  const recorded = () => Math.max(pos, clk.at(performance.now()))
  // the tape's text: the bars up to n, new ones appended rather than the whole tape set again
  const write = n => {
    const k = tape.textContent.length
    if (n > k) k ? tape.firstChild.appendData(text(lv.slice(k, n))) : tape.textContent = text(lv.slice(0, n))
  }
  const run = () => { const t = recorded(); write(Math.floor(t / dt)), place(t), ruler(), raf = requestAnimationFrame(run) }

  // a bar every 1/60 of the band's height, half of it ink, as Voice Memos draws them
  const fit = () => {
    const H = wave.clientHeight, F = 0.86 * H
    if (!H) return
    pitch = Math.max(3, Math.min(8, H / 60))
    tape.style.fontSize = `${F.toFixed(1)}px`
    const wght = weight(pitch / 2, F)
    tape.style.setProperty('--wght', wght)
    tape.style.letterSpacing = `${(pitch - wght * F / 4000).toFixed(4)}px`
    ruler(), place(pos)
  }
  // seconds along the ruler: from the start to a screen past the end
  const ruler = () => {
    const sec = pps(), n = Math.ceil(length() + wave.clientWidth / sec) + 1, key = n + ':' + sec
    if (key === ruled) return
    ruled = key
    scale.style.setProperty('--sec', `${sec.toFixed(3)}px`), scale.style.width = `${(n * sec).toFixed(1)}px`
    scale.replaceChildren(...Array.from({ length: n }, (_, s) => { const l = h('span', { textContent: short(s) }); l.style.left = `${(s * sec).toFixed(1)}px`; return l }))
  }
  // time t under the playhead; bars behind it are played, painted as a highlight
  const place = t => {
    pos = t
    const x = (wave.clientWidth / 2 - t * pps()).toFixed(2)
    tape.style.transform = `translate(${x}px, -50%)`, scale.style.transform = `translateX(${x}px)`
    time.textContent = stamp(t)
    wave.setAttribute('aria-valuenow', t.toFixed(1)), wave.setAttribute('aria-valuetext', stamp(t))
    const node = tape.firstChild
    if (node && state !== 'recording') heard.setStart(node, 0), heard.setEnd(node, Math.min(node.length, Math.round(t * RATE)))
    else heard.collapse(true)
    mark(heard)
  }
  const ui = () => {
    vm.dataset.state = state
    const off = state === 'recording' || !length()
    for (const b of [playBtn, back, fwd]) b.disabled = off
    playBtn.classList.toggle('is-playing', !!handle), playBtn.setAttribute('aria-label', handle ? 'Pause' : 'Play')
    rec.setAttribute('aria-label', { idle: 'Record', recording: 'Pause recording', paused: 'Resume recording' }[state])
    done.disabled = state === 'idle'
    wave.tabIndex = off ? -1 : 0
    wave.setAttribute('aria-valuemax', length().toFixed(1))
  }

  const stop = () => {
    if (!handle) return
    const was = handle, t = was.time()
    handle = null, cancelAnimationFrame(raf), was.stop(), place(Math.min(t, length())), ui()
  }
  const start = () => {
    clip ??= recorder?.snapshot()
    if (!clip) return
    const end = Math.min(length(), clip.duration)
    if (pos >= end - 0.05) pos = 0
    const mine = handle = play(clip, { from: pos })
    mine.onend = () => {
      if (handle !== mine) return
      handle = null, cancelAnimationFrame(raf), place(Math.min(mine.time(), end)), ui()
    }
    const tick = () => { place(Math.min(mine.time(), end)), raf = requestAnimationFrame(tick) }
    tick(), ui()
  }
  const seek = t => {
    const on = !!handle
    stop(), place(Math.max(0, Math.min(length(), t)))
    if (on) start()
  }

  playBtn.addEventListener('click', () => handle ? stop() : start())
  back.addEventListener('click', () => seek(pos - 15))
  fwd.addEventListener('click', () => seek(pos + 15))

  // recording stopped, paused or done, the bars still to come are written, and the playhead goes to the end
  const hold = () => { cancelAnimationFrame(raf), write(lv.length), place(length()) }
  rec.addEventListener('click', async () => {
    if (state === 'recording') return recorder.pause(), state = 'paused', hold(), ui()
    // the audio picks up where it stopped: the clock anchors again on the chunks to come
    if (state === 'paused') return stop(), clip = null, recorder.resume(), clk.again(), state = 'recording', ui(), run()
    if (starting) return
    starting = true, stop(), note.textContent = ''
    try {
      const r = await listen((levels, t) => { lv = levels, len.textContent = short(t), clk.hear(t, performance.now()) }, dt)
      recorder = r, clip = null, lv = [], state = 'recording', clk = clock()
      date.textContent = today(), len.textContent = short(0), tape.textContent = ''
      place(0), ui(), run()
    } catch (e) {
      note.textContent = micError(e)
    }
    starting = false
  })
  // Done keeps the recording: a WAV file under the name above the waveform. The playhead stays where it is: at the
  // end, done while recording
  done.addEventListener('click', () => {
    if (state === 'idle') return
    stop()
    if (state === 'recording') hold()
    const buf = recorder.stop(), name = title.value.trim() || 'New Recording'
    recorder = null, state = 'idle', clip = buf.duration > 0.2 ? buf : null
    if (!clip) lv = [], tape.textContent = ''
    else {
      const a = h('a', { href: URL.createObjectURL(wav(clip)), download: `${name}.wav` })
      a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 10000)
    }
    len.textContent = short(length()), ruler(), place(Math.min(pos, length())), ui()
  })

  // drag the waveform under the playhead to scrub, as in Voice Memos; playback picks up where it's let go
  wave.addEventListener('pointerdown', e => {
    if (state === 'recording' || !length() || e.button) return
    drag = { x: e.clientX, t: pos, on: !!handle }
    stop(), wave.setPointerCapture(e.pointerId), wave.classList.add('is-dragging')
  })
  wave.addEventListener('pointermove', e => {
    if (drag) place(Math.max(0, Math.min(length(), drag.t - (e.clientX - drag.x) / pps())))
  })
  const release = () => {
    if (!drag) return
    const on = drag.on
    drag = null, wave.classList.remove('is-dragging')
    if (on) start()
  }
  wave.addEventListener('pointerup', release)
  wave.addEventListener('pointercancel', release)
  // and by keys: arrows a second (with Shift, five), Page keys fifteen, Home and End, Space to play
  wave.addEventListener('keydown', e => {
    if (state === 'recording' || !length()) return
    const d = { ArrowLeft: -1, ArrowRight: 1, PageDown: -15, PageUp: 15 }[e.key]
    if (d) return e.preventDefault(), seek(pos + d * (e.shiftKey && Math.abs(d) === 1 ? 5 : 1))
    if (e.key === 'Home' || e.key === 'End') return e.preventDefault(), seek(e.key === 'Home' ? 0 : length())
    if (e.key === ' ' || e.key === 'Enter') e.preventDefault(), handle ? stop() : start()
  })

  date.textContent = today()
  new ResizeObserver(fit).observe(wave)
  ui()
}
