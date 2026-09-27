/**
 * Playground: audio – a file, your voice, a sample – or bars drawn by hand, as a line of Wavefont text,
 * with the code that writes it. Nothing leaves the browser.
 */
import wf, { bars } from '../index.js'
import { levels, speech, decode, buffer, voice, song, playing } from './sound.js'
import { clock, copy, track, listen, micError, fit } from './wave.js'
import { colour } from './code.js'
import { $, $$ } from './dom.js'

const CDN = 'https://cdn.jsdelivr.net/npm/wavefont@3/fonts/variable/Wavefont[ROND,YELA,wght].woff2'
const SR = 22050

// tones whose loudness follows a shape, besides the site's voice and song
const tone = (seconds, env, noisy) => {
  const d = new Float32Array(Math.round(seconds * SR))
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
  saw: () => tone(4, t => (t * 1.25) % 1),
  square: () => tone(4, t => (t * 1.25) % 1 < 0.5 ? 1 : 0.02),
  noise: () => tone(4, t => 0.3 + 0.7 * Math.abs(Math.sin(2 * Math.PI * 0.9 * t) * Math.sin(2 * Math.PI * 0.23 * t)), true)
}

export function playground() {
  const preview = $('.pg-preview'), text = preview.firstElementChild, pad = $('.pg-pad')
  const status = $('.pg-status'), out = $('.pg-code'), rec = $('.pg-rec'), draw = $('.pg-draw')
  const input = name => $(`[name="${name}"]:is(:checked, :not([type=radio]))`)
  const val = name => { const i = input(name); return i.type === 'checkbox' ? i.checked : i.type === 'radio' ? i.value : +i.value }
  let source = null, result = null, recorder = null, drawing = null, tab = 'js'

  const ui = on => $('.pg-play').classList.toggle('is-playing', on)
  const trAudio = track(text, { ontime: t => $('.t-now').textContent = clock(t), onstate: ui })
  // on the pad, a click draws: it doesn't pick a bar to play from
  const trDraw = track(pad, { ontime: t => $('.t-now').textContent = clock(t), onstate: ui, pick: false })

  // ── audio → text: loudness per slice (pauses as spaces), or each slice from its lowest sample to its highest
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
    const lv = levels(d, n, val('range'))
    if (val('pauses')) return { lv, take: { buf: source, ...speech(lv, dt, false, 0.14, Math.max(2, Math.round(0.25 / dt))) } }
    return { lv, take: { buf: source, text: wf(Array.from(lv, v => v * 100)), at } }
  }
  const analyse = () => {
    if (!source || drawing) return
    result = drawn()
    trAudio.set(result.take)
    $('.t-all').textContent = clock(source.duration)
    $('.pg-info').textContent = `${clock(source.duration)}, ${[...result.take.text].filter(c => c !== ' ').length.toLocaleString('en')} bars`
    code()
  }

  // ── the pencil: bars drawn by hand; played, a soft tone follows their heights
  const DRAW = 48
  const sound = vs => {
    const per = 1 / val('rate'), d = new Float32Array(Math.round(vs.length * per * SR))
    for (let i = 0, ph = 0; i < d.length; i++) {
      const k = i / SR / per, a = vs[Math.min(vs.length - 1, k | 0)] / 100, b = vs[Math.min(vs.length - 1, (k | 0) + 1)] / 100
      ph += 2 * Math.PI * 220 / SR
      d[i] = 0.5 * (a + (b - a) * (k % 1)) * (Math.sin(ph) + 0.25 * Math.sin(2 * ph))
    }
    return buffer(d, SR)
  }
  const paint = () => {
    const buf = sound(drawing), dt = buf.duration / drawing.length
    trDraw.set({ buf, text: wf(drawing), at: Array.from({ length: drawing.length + 1 }, (_, i) => i * dt) })
    fit(pad, drawing.length, 0.5)
    $('.t-all').textContent = clock(buf.duration), $('.pg-info').textContent = `${drawing.length} bars, drawn`
    result = { lv: drawing.map(v => v / 100), take: { text: pad.textContent } }
    code()
  }
  const pencil = on => {
    playing()?.stop()
    drawing = on ? (drawing ?? Array.from({ length: DRAW }, (_, i) => 20 + 60 * Math.sin(Math.PI * (i + 0.5) / DRAW) ** 2)) : null
    draw.setAttribute('aria-pressed', on), preview.hidden = on, pad.hidden = !on
    $('.pg-title').textContent = on ? 'drawing' : source ? $('.pg-title').dataset.name : ''
    document.body.classList.toggle('is-drawing', on)
    on ? paint() : (analyse(), $('.t-all').textContent = source ? clock(source.duration) : '0:00')
  }
  let last = null
  const stroke = e => {
    const b = pad.getBoundingClientRect(), n = drawing.length
    const i = Math.max(0, Math.min(n - 1, Math.floor((e.clientX - b.left) / b.width * n)))
    const v = Math.max(1, Math.min(100, (b.bottom - e.clientY) / b.height * 100))
    // between the last point and this one, every bar gets its share: a quick stroke leaves no gaps
    const [i0, v0] = last ?? [i, v]
    for (let k = Math.min(i0, i); k <= Math.max(i0, i); k++) drawing[k] = i === i0 ? v : v0 + (v - v0) * (k - i0) / (i - i0)
    last = [i, v], pad.textContent = wf(drawing)
  }
  pad.addEventListener('pointerdown', e => { playing()?.stop(), pad.setPointerCapture(e.pointerId), last = null, stroke(e) })
  pad.addEventListener('pointermove', e => e.buttons && stroke(e))
  pad.addEventListener('pointerup', () => { last = null, paint() })
  draw.addEventListener('click', () => pencil(!drawing))

  // ── style: the axes, size and spacing
  const style = () => {
    preview.style.setProperty('--wght', val('wght')), preview.style.setProperty('--yela', val('yela'))
    for (const el of [preview, pad]) el.style.setProperty('--rond', val('rond'))
    preview.style.setProperty('--gap', val('gap') + 'em'), preview.style.fontSize = val('size') + 'px'
    const labels = { rate: v => `${v}/s`, range: v => `${v} dB`, wght: v => v, rond: v => v, yela: v => v, size: v => `${v}px`, gap: v => `${(+v).toFixed(3)}em` }
    for (const [k, f] of Object.entries(labels)) input(k).nextElementSibling.textContent = f(val(k))
    const loud = val('mode') === 'loudness'
    $$('.loud').forEach(e => e.classList.toggle('off', !loud)), $$('.loud input').forEach(i => i.disabled = !loud)
    if (drawing) fit(pad, drawing.length, 0.5)
    code()
  }

  // ── code: the same bars as JavaScript, as HTML, or as the text itself
  const code = () => {
    if (!result) return
    const t = result.take.text, ints = a => '[' + Array.from(a, v => Math.round(v)).join(', ') + ']'
    const axes = `'wght' ${val('wght')}, 'ROND' ${val('rond')}` + (result.lo ? '' : `, 'YELA' ${val('yela')}`)
    const css = `font: ${val('size')}px/1.25 wavefont; font-variation-settings: ${axes}; letter-spacing: ${val('gap')}em`
    const src = {
      js: result.lo
        ? `import { bars } from 'wavefont'\n\n// one bar per slice, from its lowest level to its highest (0–127, 64 the middle)\nel.textContent = bars(\n  ${ints(result.lo)},\n  ${ints(result.hi)}\n)`
        : `import wf from 'wavefont'\n\n// ${drawing ? 'the bars drawn' : 'loudness per slice'}, 0–100\nel.textContent = wf(${ints(Array.from(result.lv, v => v * 100))})`,
      html: `<style>\n@font-face { font-family: wavefont; font-display: block; src: url(${CDN}) format('woff2'); }\n</style>\n<span style="${css}">${t}</span>`,
      text: t
    }[tab]
    out.innerHTML = colour(src, tab === 'text' ? '' : tab)
    out.dataset.raw = src
  }
  $$('.pg-tabs button').forEach(b => b.addEventListener('click', () => {
    tab = b.dataset.tab, $$('.pg-tabs button').forEach(x => x.setAttribute('aria-selected', x === b)), code()
  }))

  // ── sources
  const use = (buf, label) => {
    if (drawing) pencil(false)
    source = buf, $('.pg-title').textContent = $('.pg-title').dataset.name = label, status.textContent = '', analyse()
  }
  const sample = () => use(SAMPLES[val('sample')](), val('sample'))
  const open = async file => {
    if (!file) return
    status.textContent = `Decoding ${file.name}…`
    try { use(await decode(file), file.name), $$('[name="sample"]').forEach(i => i.checked = false) }
    catch { status.textContent = `${file.name} could not be decoded. Try an mp3, wav, ogg or m4a file.` }
  }
  input('file').addEventListener('change', e => open(e.target.files[0]))
  $$('[name="sample"]').forEach(i => i.addEventListener('change', sample))
  addEventListener('dragover', e => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(), preview.classList.add('pg-drop') })
  addEventListener('dragleave', e => e.relatedTarget || preview.classList.remove('pg-drop'))
  addEventListener('drop', e => { preview.classList.remove('pg-drop'); const f = e.dataTransfer?.files[0]; if (f) e.preventDefault(), open(f) })

  rec.addEventListener('click', async () => {
    if (recorder) {
      const buf = recorder.stop()
      recorder = null
      preview.classList.remove('live'), rec.classList.remove('is-on'), $('.rec-label').textContent = 'Record'
      $$('[name="sample"]').forEach(i => i.checked = false)
      return buf.duration > 0.2 ? use(buf, 'recording') : (status.textContent = 'Nothing came through. Check the microphone and try again.', analyse())
    }
    playing()?.stop()
    if (drawing) pencil(false)
    try {
      recorder = await listen((lv, s) => { text.textContent = speech(lv, 0.05, true).text, $('.t-now').textContent = clock(s) })
      preview.classList.add('live'), text.textContent = ''
      rec.classList.add('is-on'), $('.rec-label').textContent = 'Stop'
    } catch (e) { status.textContent = micError(e) }
  })

  $('.pg-play').addEventListener('click', () => { const tr = drawing ? trDraw : trAudio; tr.take && tr.toggle() })
  $('.pg-copy').addEventListener('click', e => copy(e.currentTarget, out.dataset.raw ?? ''))
  for (const i of $$('.pg-panel input:not([type=file]):not([name=sample])')) i.addEventListener('input', () => {
    if (['rate', 'range', 'pauses', 'mode'].includes(i.name)) drawing ? paint() : analyse()
    style()
  })

  // ?src=https://… loads audio from a link (the server must allow cross-origin reads)
  const src = new URLSearchParams(location.search).get('src')
  style()
  if (src) {
    status.textContent = 'Loading audio…'
    fetch(src).then(r => r.blob()).then(b => open(new File([b], decodeURIComponent(src.split('/').pop()) || 'audio')))
      .catch(() => { status.textContent = 'That link could not be loaded here. Download the file and open it instead.', sample() })
  } else sample()
}
