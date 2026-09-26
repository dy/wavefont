/**
 * A messenger thread where voice messages are text set in Wavefont: click a bar to play from it, select bars to hear them.
 * Type, or record yourself; the other side is out walking, and answers by voice.
 */
import wf from '../index.js'
import { voice, playing } from './sound.js'
import { clock, strip, track, listen } from './wave.js'
import { $, h, soon, noise, still, PLAY } from './dom.js'

const RATES = [1, 1.5, 2]

/** Bars in a bubble: about four a second, within what a bubble holds. */
const count = buf => Math.round(Math.min(34, Math.max(14, buf.duration * 4)))

export function chat() {
  const thread = $('.thread'), form = $('.composer'), input = $('.composer-input'), btn = $('.mic')
  const tape = $('.composer-tape > span'), ctime = $('.composer-time')
  const r = noise(21)
  let recorder = null, starting = false, pending = 0, answering = false, seed = 40

  const bubble = buf => {
    const pp = h('button', { type: 'button', className: 'pp', innerHTML: PLAY })
    const wave = h('span', { className: 'wave wf' }), dur = h('span', { className: 'dur', textContent: clock(buf.duration) })
    const speed = h('button', { type: 'button', className: 'speed', textContent: '1×' })
    pp.setAttribute('aria-label', `Play voice message, ${clock(buf.duration)}`)
    speed.setAttribute('aria-label', 'Playback speed 1×')
    const tr = track(wave, {
      ontime: t => dur.textContent = clock(t || buf.duration),
      onstate: on => { pp.classList.toggle('is-playing', on), pp.setAttribute('aria-label', `${on ? 'Pause' : 'Play'} voice message, ${clock(buf.duration)}`) }
    })
    tr.set(strip(buf, count(buf), 18))
    pp.addEventListener('click', () => tr.toggle())
    // faster keeps the voice's pitch: the <audio> element time-stretches
    let k = 0
    speed.addEventListener('click', () => {
      const x = RATES[k = (k + 1) % RATES.length]
      speed.textContent = x + '×', speed.setAttribute('aria-label', `Playback speed ${x}×`), tr.rate(x)
    })
    return h('div', { className: 'bubble' }, pp, wave, h('span', { className: 'meta' }, dur, speed))
  }
  /** A message: text, a recording, or a bubble element; `when` stamps it. */
  const say = (body, out, when) => {
    const li = h('li', { className: 'msg ' + (out ? 'out' : 'in') })
    if (when) li.append(h('span', { className: 'when', textContent: when }))
    li.append(typeof body === 'string' ? h('div', { className: 'bubble textual', textContent: body }) : body.getChannelData ? bubble(body) : body)
    return li
  }
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
    const buf = voice(seed++, 2.5 + r() * 6, 150), take = strip(buf, count(buf), 18).text
    const wave = h('span', { className: 'wave wf' }), live = h('div', { className: 'bubble live' }, h('span', { className: 'rec' }), wave)
    live.setAttribute('role', 'status'), live.setAttribute('aria-label', 'Recording a voice message')
    const li = add(say(live, false)), t0 = performance.now(), T = still ? 0 : buf.duration * 450
    const step = now => {
      const k = T ? Math.min(1, (now - t0) / T) : 1
      wave.textContent = take.slice(0, Math.ceil(k * take.length))
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
        tape.textContent = wf(lv.slice(-80).map(v => Math.max(4, v * 100))), ctime.textContent = clock(t)
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
      say(voice(3, 6.2, 150), false, '9:41'),
      say('Walking, can’t type. Listen when you can', false),
      say(voice(5, 9.4, 205), true),
      say(voice(8, 3.3, 150), false)
    )
    thread.scrollTop = thread.scrollHeight
  })
}
