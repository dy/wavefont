/**
 * A messenger thread where voice messages are text set in Wavefont: click a bar to play from it, select bars to hear them.
 * Type, or record yourself; the other side is out walking, and answers by voice.
 */
import wf from '../index.js'
import { voice, playing } from './sound.js'
import { clock, strip, track, listen, fit } from './wave.js'
import { $, h, soon, noise } from './dom.js'

// a triangle and two bars with round corners, as the bars have round caps
const PLAY = '<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path class="i-play round" d="M4 2.6v10.8L13.4 8z"/><path class="i-pause round" d="M3.6 2.5h2.8v11H3.6zM9.6 2.5h2.8v11H9.6z"/></svg>'
// the reference's proportions: bars close together, a little under half of each pitch inked (em, of the bars' height)
const PITCH = 0.13, FILL = 0.45

/** Bars in a bubble: about six a second, within what a bubble holds. */
const count = buf => Math.round(Math.min(40, Math.max(20, buf.duration * 6)))
/** The oldest bars of a live recording lower as they go, rather than being cut: WhatsApp's way. */
const taper = (lv, n, soft = 10) => lv.slice(-n).map((v, i, a) => Math.max(4, v * 100) * Math.min(1, (i + 1 + (n - a.length)) / soft))

export function chat() {
  const thread = $('.thread'), form = $('.composer'), input = $('.composer-input'), btn = $('.mic')
  const tape = $('.composer-tape'), bars = $('.composer-tape > span'), ctime = $('.composer-time')
  const r = noise(21)
  let recorder = null, starting = false, pending = 0, answering = false, seed = 40
  // each waveform gets whole-pixel bars and ends where its last bar does: the time follows it at the bubble's gap,
  // as the bars follow the play button. Set once a message is in, and again as the thread resizes
  const size = el => {
    const n = +el.dataset.n, P = fit(el, n, FILL, n * PITCH * parseFloat(getComputedStyle(el).fontSize))
    if (P) el.style.width = `${(n * P - parseFloat(el.style.getPropertyValue('--gap'))).toFixed(3)}px`
  }
  const settle = () => thread.querySelectorAll('.wave').forEach(size)
  new ResizeObserver(settle).observe(thread)

  const wave = (text, n) => {
    const el = h('span', { className: 'wave wf', textContent: text })
    el.dataset.n = n
    return el
  }
  const bubble = buf => {
    const n = count(buf), take = strip(buf, n, 18), line = wave('', n)
    const pp = h('button', { type: 'button', className: 'pp', innerHTML: PLAY })
    const dur = h('span', { className: 'dur', textContent: clock(buf.duration) })
    const el = h('div', { className: 'bubble voice' }, pp, line, dur)
    pp.setAttribute('aria-label', `Play voice message, ${clock(buf.duration)}`)
    const tr = track(line, {
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
  // the thread holds whole messages: those that no longer fit leave from the top
  const trim = () => { while (thread.children.length > 1 && thread.firstElementChild.offsetTop < 0) thread.firstElementChild.remove() }
  const add = li => {
    li.classList.add('fresh'), thread.append(li), settle(), trim()
    return li
  }

  // a while after your last message, the other side records an answer: its bars come in as it's spoken, as long as
  // it takes to say
  const answer = () => { clearTimeout(pending), pending = setTimeout(reply, 1400) }
  const reply = () => {
    if (answering) return answer()
    answering = true
    const buf = voice(seed++, 2.5 + r() * 6, 150), n = count(buf), take = strip(buf, n, 18).text, line = wave('', n)
    const live = h('div', { className: 'bubble voice live' }, h('span', { className: 'rec' }), line)
    live.setAttribute('role', 'status'), live.setAttribute('aria-label', 'Recording a voice message')
    const li = add(say(live, false)), t0 = performance.now(), T = buf.duration * 1000
    const step = now => {
      const k = Math.min(1, (now - t0) / T)
      line.textContent = take.slice(0, Math.ceil(k * take.length))
      if (k < 1) return requestAnimationFrame(step)
      li.replaceWith(say(buf, false)), settle(), trim(), answering = false
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
      // the bubbles' bars: their pitch and weight
      const pitch = fit(tape, 1, FILL, PITCH * parseFloat(getComputedStyle(tape).fontSize))
      recorder = await listen((lv, t) => {
        // as many bars as the field holds
        bars.textContent = wf(taper(lv, Math.max(1, Math.floor(tape.clientWidth / pitch)))), ctime.textContent = clock(t)
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
    form.classList.remove('is-on'), input.disabled = false, ctime.textContent = '', bars.textContent = '', sync()
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
    settle(), trim()
  })
}
