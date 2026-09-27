/**
 * Playground: your audio – a file, your voice, a sample – as a line of Wavefont text, and the code that writes it.
 * Nothing leaves the browser.
 */
import wf, { bars } from '../index.js'
import { levels, speech, decode, buffer, voice, song, playing } from './sound.js'
import { clock, copy, track, listen, micError } from './wave.js'
import { $, $$, soon } from './dom.js'

const CDN = 'https://cdn.jsdelivr.net/npm/wavefont@3/fonts/variable/Wavefont[ROND,YELA,wght].woff2'
const SR = 22050

// tones whose loudness follows a shape, besides the site's voice and song
const tone = (seconds, env, noisy) => {
  const d = new Float32Array(seconds * SR)
  for (let i = 0; i < d.length; i++) {
    const t = i / SR, x = noisy ? Math.random() * 2 - 1 : Math.sin(2 * Math.PI * 220 * t) + 0.3 * Math.sin(2 * Math.PI * 440 * t)
    d[i] = 0.6 * env(t) * x
  }
  return buffer(d, SR)
}
const SAMPLES = {
  voice: () => voice(11, 9, 150),
  song: () => song(44100, 0.5),
  sine: () => tone(4, t => 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.25 * t)),
  noise: () => tone(4, t => 0.3 + 0.7 * Math.abs(Math.sin(2 * Math.PI * 0.9 * t) * Math.sin(2 * Math.PI * 0.23 * t)), true)
}

export function playground() {
  const sec = $('#playground'), preview = $('.pg-preview'), text = preview.firstElementChild
  const status = $('.pg-status'), out = $('.pg-code'), rec = $('.pg-rec'), recLabel = $('.pg-rec .rec-label')
  const input = name => $(`#playground [name="${name}"]:is(:checked, :not([type=radio]))`)
  const val = name => { const i = input(name); return i.type === 'radio' ? i.value : +i.value }
  let source = null, result = null, recorder = null

  const tr = track(text, {
    ontime: t => $('.pg-time .t-now').textContent = clock(t),
    onstate: on => $('.pg-play').classList.toggle('is-playing', on)
  })

  // audio → text: loudness per slice (pauses as spaces), or each slice from its lowest sample to its highest
  const drawn = () => {
    const d = source.getChannelData(0), n = Math.max(4, Math.min(20000, Math.round(source.duration * val('rate'))))
    const dt = source.duration / n, at = Array.from({ length: n + 1 }, (_, i) => i * dt)
    if (val('mode') === 'minmax') {
      let peak = 0
      for (const x of d) peak = Math.max(peak, Math.abs(x))
      const lo = new Float32Array(n), hi = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        let a = 0, b = 0
        for (let j = Math.floor(i * d.length / n), e = Math.floor((i + 1) * d.length / n); j < e; j++) a = Math.min(a, d[j]), b = Math.max(b, d[j])
        lo[i] = 64 * (a / (peak || 1) + 1), hi[i] = 64 * (b / (peak || 1) + 1)
      }
      return { lo, hi, take: { buf: source, text: bars(lo, hi), at } }
    }
    const lv = levels(d, n)
    return { lv, take: { buf: source, ...speech(lv, dt, false, 0.14, Math.max(2, Math.round(0.25 / dt))) } }
  }
  const analyse = () => {
    if (!source) return
    result = drawn()
    tr.set(result.take)
    $('.pg-time .t-all').textContent = clock(source.duration)
    $('.pg-info').textContent = `${clock(source.duration)}, ${[...result.take.text].filter(c => c !== ' ').length.toLocaleString('en')} bars`
    code()
  }
  const style = () => {
    preview.style.setProperty('--wght', val('wght')), preview.style.setProperty('--rond', val('rond'))
    for (const k of ['rate', 'wght', 'rond']) input(k).nextElementSibling.textContent = k === 'rate' ? `${val(k)}/s` : val(k)
    code()
  }
  const code = () => {
    if (!result) return
    const t = result.take.text, ints = a => '[' + Array.from(a, v => Math.round(v)).join(', ') + ']'
    const css = `font: 48px/1.25 wavefont; font-variation-settings: 'wght' ${val('wght')}, 'ROND' ${val('rond')}; letter-spacing: 0.08em`
    out.textContent = {
      text: t,
      html: `<style>\n@font-face { font-family: wavefont; font-display: block; src: url(${CDN}) format('woff2'); }\n</style>\n<span style="${css}">${t}</span>`,
      js: result.lo
        ? `import { bars } from 'wavefont'\n\n// one bar per slice, from its lowest level to its highest (0–127, 64 is the middle)\nel.textContent = bars(\n  ${ints(result.lo)},\n  ${ints(result.hi)}\n)`
        : `import wf from 'wavefont'\n\n// loudness per slice, 0–100\nel.textContent = wf(${ints(Array.from(result.lv, v => v * 100))})`
    }[val('out')]
  }

  const use = (buf, label) => { source = buf, $('.pg-title').textContent = label, status.textContent = '', analyse() }
  const sample = () => use(SAMPLES[val('sample')](), val('sample'))
  const open = async file => {
    if (!file) return
    status.textContent = `Decoding ${file.name}…`
    try { use(await decode(file), file.name), $$('#playground [name="sample"]').forEach(i => i.checked = false) }
    catch { status.textContent = `${file.name} could not be decoded. Try an mp3, wav, ogg or m4a file.` }
  }

  input('file').addEventListener('change', e => open(e.target.files[0]))
  $$('#playground [name="sample"]').forEach(i => i.addEventListener('change', sample))
  // a file dropped anywhere on the page lands here
  addEventListener('dragover', e => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(), preview.classList.add('pg-drop') })
  addEventListener('dragleave', e => e.relatedTarget || preview.classList.remove('pg-drop'))
  addEventListener('drop', e => {
    const file = e.dataTransfer?.files[0]
    preview.classList.remove('pg-drop')
    if (!file) return
    e.preventDefault(), sec.scrollIntoView(), open(file)
  })

  rec.addEventListener('click', async () => {
    if (recorder) {
      const buf = recorder.stop()
      recorder = null
      preview.classList.remove('live'), rec.classList.remove('is-on'), recLabel.textContent = 'Record'
      $$('#playground [name="sample"]').forEach(i => i.checked = false)
      return buf.duration > 0.2 ? use(buf, 'recording') : (status.textContent = 'Nothing came through. Check the microphone and try again.', analyse())
    }
    playing()?.stop()
    try {
      recorder = await listen((lv, s) => { text.textContent = speech(lv, 0.05, true).text, $('.pg-time .t-now').textContent = clock(s) })
      preview.classList.add('live'), text.textContent = ''
      rec.classList.add('is-on'), recLabel.textContent = 'Stop'
    } catch (e) { status.textContent = micError(e) }
  })

  $('.pg-play').addEventListener('click', () => tr.take && tr.toggle())
  $('.pg-copy').addEventListener('click', e => copy(e.currentTarget, out.textContent))
  for (const i of $$('#playground input:not([type=file]):not([name=sample])')) i.addEventListener('input', () => {
    if (i.name === 'rate' || i.name === 'mode') analyse(), style()
    else if (i.name === 'out') code()
    else style()
  })

  // ?src=https://… loads audio from a link (the server must allow cross-origin reads)
  const src = new URLSearchParams(location.search).get('src')
  if (src) {
    status.textContent = 'Loading audio…'
    fetch(src).then(r => r.blob()).then(b => open(new File([b], decodeURIComponent(src.split('/').pop()) || 'audio')))
      .catch(() => { status.textContent = 'That link could not be loaded here. Download the file and open it instead.', sample() })
  } else soon(sec, sample)
  style()
}
