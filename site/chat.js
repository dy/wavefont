/**
 * A messenger thread where voice messages are text set in Wavefont: click a bar to play from it, select bars to hear them.
 * Type, or record yourself; the other side is out walking, and answers by voice.
 */
import wf from '../index.js'
import { voice, playing } from './sound.js'
import { clock, strip, track, listen, fit } from './wave.js'
import { $, h, soon, noise, still } from './dom.js'

const PLAY = '<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path class="i-play" d="M3 1.2v13.6L15 8z"/><path class="i-pause" d="M2.5 1.5h4v13h-4zM9.5 1.5h4v13h-4z"/></svg>'
const PITCH = 0.3, FILL = 0.36 // em a bar, share of it inked: the reference bubble's proportions

/** Bars in a bubble: about four a second, within what a bubble holds. */
const count = buf => Math.round(Math.min(32, Math.max(14, buf.duration * 4)))

export function chat() {
  const thread = $('.thread'), form = $('.composer'), input = $('.composer-input'), btn = $('.mic')
  const tape = $('.composer-tape > span'), ctime = $('.composer-time')
  const r = noise(21)
  let recorder = null, starting = false, pending = 0, answering = false, seed = 40
  // each waveform, once laid out, gets whole-pixel bars
  const sizing = new ResizeObserver(es => es.forEach(e => fit(e.target, +e.target.dataset.n, FILL)))

  const wave = (text, n) => {
    const el = h('span', { className: 'wave wf', textContent: text })
    el.dataset.n = n, el.style.width = `${(n * PITCH).toFixed(2)}em`
    sizing.observe(el)
    return el
  }
  const bubble = buf => {
    const n = count(buf), take = strip(buf, n, 18), bars = wave('', n)
    const pp = h('button', { type: 'button', className: 'pp', innerHTML: PLAY })
    const dur = h('span', { className: 'dur', textContent: clock(buf.duration) })
    const el = h('div', { className: 'bubble voice' }, pp, bars, dur)
    pp.setAttribute('aria-label', `Play voice message, ${clock(buf.duration)}`)
    const tr = track(bars, {
      ontime: t => dur.textContent = clock(t || buf.duration),
      onstate: on => { el.classList.toggle('is-playing', on), pp.classList.toggle('is-playing', on), pp.setAttribute('aria-label', `${on ? 'Pause' : 'Play'} voice message, ${clock(buf.duration)}`) }
    })
    tr.set(take)
    pp.addEventListener('click', () => tr.toggle())
    return el
  }
  /** A message: text, a recording, or a bubble element. */
  const say = (body, out) => h('li', { className: 'msg ' + (out ? 'out' : 'in') },
    typeof body === 'string' ? h('div', { className: 'bubble textual', textContent: body }) : body.getChannelData ? bubble(body) : body)
  const add = li => {
    li.classList.add('fresh'), thread.append(li)
    thread.scrollTo({ top: thread.scrollHeight, behavior: still ? 'auto' : 'smooth' })
    return li
  }

  // a while after your last message, the other side records an answer: its bars come in as it's spoken
  const answer = () => { clearTimeout(pending), pending = setTimeout(reply, 1400) }
  const reply = () => {
    if (answering) return answer()
    answering = true
    const buf = voice(seed++, 2.5 + r() * 6, 150), n = count(buf), take = strip(buf, n, 18).text, bars = wave('', n)
    const live = h('div', { className: 'bubble voice live' }, h('span', { className: 'rec' }), bars)
    live.setAttribute('role', 'status'), live.setAttribute('aria-label', 'Recording a voice message')
    const li = add(say(live, false)), t0 = performance.now(), T = still ? 0 : buf.duration * 450
    const step = now => {
      const k = T ? Math.min(1, (now - t0) / T) : 1
      bars.textContent = take.slice(0, Math.ceil(k * take.length))
      if (k < 1) return requestAnimationFrame(step)
      li.replaceWith(say(buf, false)), answering = false
    }
    requestAnimationFrame(step)
  }

  const sync = () => {
    const typed = input.value.trim() !== ''
    form.classList.toggle('has-text', typed && !recorder)
    btn.setAttribute('aria-label', recorder ? 'Stop and send' : typed ? 'Send' : 'Record a voice message')
  }
  const send = () => {
    const text = input.value.trim()
    if (!text) return
    input.value = '', sync()
    add(say(text, true)), answer()
  }
  const begin = async () => {
    if (starting) return
    starting = true, playing()?.stop()
    try {
      recorder = await listen((lv, t) => {
        tape.textContent = wf(lv.slice(-60).map(v => Math.max(4, v * 100))), ctime.textContent = clock(t)
        if (t >= 60) end()
      })
      form.classList.add('is-on'), input.disabled = true, input.placeholder = 'Message', sync()
    } catch (e) {
      input.placeholder = e.name === 'NotAllowedError' ? 'Microphone blocked' : 'No microphone'
    }
    starting = false
  }
  const end = () => {
    if (!recorder) return
    const buf = recorder.stop()
    recorder = null
    form.classList.remove('is-on'), input.disabled = false, ctime.textContent = '', tape.textContent = '', sync()
    if (buf.duration < 0.3) return
    add(say(buf, true)), answer()
  }

  input.addEventListener('input', sync)
  form.addEventListener('submit', e => { e.preventDefault(), send() })
  btn.addEventListener('click', () => recorder ? end() : input.value.trim() ? send() : begin())

  soon(thread, () => {
    thread.prepend(
      say(voice(3, 6.2, 150), false),
      say('Walking, can’t type. Listen when you can', false),
      say(voice(5, 9.4, 205), true),
      say(voice(8, 3.3, 150), false)
    )
    thread.scrollTop = thread.scrollHeight
  })
}
