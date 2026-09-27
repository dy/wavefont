/**
 * Code, coloured: comments, strings, keywords (tags, in HTML) and numbers become spans the stylesheet colours –
 * .c .s .k .n. Enough for the snippets on this site; no parser.
 */
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])

const RULES = {
  js: [/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|const|let|var|new|return|function|await|async|if|else|for|of)\b|\b(\d+(?:\.\d+)?)\b/g, ['c', 's', 'k', 'n']],
  html: [/(<!--[\s\S]*?-->)|("[^"]*"|'[^']*')|(<\/?[\w-]+|\/?>)|([\w-]+)(?==)/g, ['c', 's', 'k', 'n']],
  sh: [/(#[^\n]*)|('[^']*'|"[^"]*")|^(\w+)/gm, ['c', 's', 'k']]
}

/** HTML for code in a language: js, html or sh; anything else comes back escaped. */
export const colour = (code, lang) => {
  const [re, kinds] = RULES[lang] ?? []
  if (!re) return esc(code)
  let out = '', at = 0
  for (const m of code.matchAll(re)) {
    const k = m.slice(1).findIndex(g => g !== undefined)
    out += esc(code.slice(at, m.index)) + `<span class="${kinds[k]}">${esc(m[0])}</span>`
    at = m.index + m[0].length
  }
  return out + esc(code.slice(at))
}
