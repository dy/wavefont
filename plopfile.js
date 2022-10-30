const dedent = require('dedent')

// const UPM = 2048
const UPM = 1000

const ZERO_CHAR = ` \t`.split('').map(v=>v.charCodeAt(0)) //[0x09,0x0a,0x0b,0x0c,0x0d,0x20,0x85,0xa0,0x1680,0x180e,0x2000,0x2001,0x2002,0x2003,0x2004,0x2005,0x2006,0x2007,0x2008,0x2009,0x200a,0x200b,0x200c,0x200d,0x2028,0x2029,0x202f,0x205f,0x2060,0x2061,0x2062,0x3000,0xfeff].map(String.fromCharCode)

const ONE_CHAR = `.-_`.split('').map(v=>v.charCodeAt(0)) //`.-–—―_¯ˉˍ˗‐‑‒‾⁃⁻₋−⎯⏤─➖⸺⸻𐆑`

const MAX_CHAR = [`|`].map(v=>v.charCodeAt(0)) //`|｜ǀ∣│।`

const BAR_CHAR = `▁▂▃▄▅▆▇█`.split('').map(v=>v.charCodeAt(0))

const FONTFACE = {
  wavefont10: {
    name: 'wavefont10',
    min: 0,
    max: 10,
    alias: {
      // NOTE: no need to stub 0s because they're covered by fallback blank font
      // 0: [...ZERO_CHAR, ...ASCII_CHAR.filter(code => !`0123456789abcdef`.includes(String.fromCharCode(code)) && !ONE_CHAR.includes(code) && !MAX_CHAR.includes(code))],
      1: ONE_CHAR,
      10: [...MAX_CHAR, ...`abcdef`.split('').map(v => v.charCodeAt(0))]
    },
    values: `0123456789a`.split(``).map(v => v.charCodeAt(0))
  },

  wavefont100: {
    name: 'wavefont100',
    min: 0,
    max: 100,
    alias: {
      1: [...ONE_CHAR, BAR_CHAR[0]],
      14: [BAR_CHAR[1]], 28: [BAR_CHAR[2]], 42: [BAR_CHAR[3]], 56: [BAR_CHAR[4]], 72: [BAR_CHAR[5]], 86: [BAR_CHAR[6]],
      10: [49], 20: [50], 30: [51], 40: [52], 50: [53], 60: [54], 70: [55], 80: [56], 90: [57],
      100: [...MAX_CHAR, BAR_CHAR[7]]
    },
    values: Array.from({length: 108}).map((v,i)=>(0x0100 + i))
  },

  wavefont255: {
    name: 'wavefont255',
    min: 0, max: 255,
    values: Array.from({length: 255})
  },

}

const AXES = {
  width: {tag: 'wdth', min: 1, max: 1000, default: 1},
  weight: {tag: 'wght', min: 1, max: 1000, default: 1},
  align: {tag: 'algn', min: 0, max: 1, default: 0},
  radius: {tag: 'radi', min: 0, max: 50, default: 0}
}

module.exports = function (plop) {
	plop.setGenerator('build-ufo', {
    description: 'Build font-face UFOs',
    prompts: [{name: 'faceName', message: 'font-face name', type: 'text'}],
		actions: ({faceName}) => {
      const face = FONTFACE[faceName], axes = AXES

      // convert value to units-per-em (0-100 → 0-2048)
      const upm = (v) => (UPM * v / face.max)
      // int to 4-digit hex
      const hex = (v) => v.toString(16).toUpperCase().padStart(4,0)
      // int to u0000 form
      const uni = (v) => Array.isArray(v) ? v.map(v => `u${hex(parseInt(v))}`).join(',') : `u${hex(parseInt(v))}`

      // uni 1 → uni0001
      plop.setHelper('uni', uni);

      // upm x →
      plop.setHelper('upm', upm);

      // hex x →
      plop.setHelper('hex', hex);

      // sub 1 2 → -1
      plop.setHelper('sub', (a,b) => a-b);

      // half 1 → .5
      plop.setHelper('half', (a) => a*.5);

      // int 12.3 → 12
      plop.setHelper('int', v => v.toFixed(3))

      // variable font axes
      const {width, weight, align, radius} = axes

      // clip values are more horizontal than vertical - need alternative glyph
      const clips = face.values.filter((c, v) => upm(v) < AXES.width.max)

      // create master cases
      const masters = {}
      const k = (w=1,b,a,r) => `w${w}b${b}a${a}r${r}`, v = (w=1,b,a,r) => ({width:w, weight:b, align:a, radius:r})
      masters[k(width.min, weight.min, align.min, radius.min)] = v(width.min, weight.min, align.min, radius.min)
      masters[k(width.min, weight.min, align.min, radius.max)] = v(width.min, weight.min, align.min, radius.max)
      masters[k(width.min, weight.min, align.max, radius.min)] = v(width.min, weight.min, align.max, radius.min)
      masters[k(width.min, weight.min, align.max, radius.max)] = v(width.min, weight.min, align.max, radius.max)
      masters[k(width.min, weight.max, align.min, radius.min)] = v(width.min, weight.max, align.min, radius.min)
      masters[k(width.min, weight.max, align.min, radius.max)] = v(width.min, weight.max, align.min, radius.max)
      masters[k(width.min, weight.max, align.max, radius.min)] = v(width.min, weight.max, align.max, radius.min)
      masters[k(width.min, weight.max, align.max, radius.max)] = v(width.min, weight.max, align.max, radius.max)
      masters[k(width.max, weight.min, align.min, radius.min)] = v(width.max, weight.min, align.min, radius.min)
      masters[k(width.max, weight.min, align.min, radius.max)] = v(width.max, weight.min, align.min, radius.max)
      masters[k(width.max, weight.min, align.max, radius.min)] = v(width.max, weight.min, align.max, radius.min)
      masters[k(width.max, weight.min, align.max, radius.max)] = v(width.max, weight.min, align.max, radius.max)
      masters[k(width.max, weight.max, align.min, radius.min)] = v(width.max, weight.max, align.min, radius.min)
      masters[k(width.max, weight.max, align.min, radius.max)] = v(width.max, weight.max, align.min, radius.max)
      masters[k(width.max, weight.max, align.max, radius.min)] = v(width.max, weight.max, align.max, radius.min)
      masters[k(width.max, weight.max, align.max, radius.max)] = v(width.max, weight.max, align.max, radius.max)

      return [
        // populate source skeleton
        {
          type: 'addMany',
          force: true,
          destination: `${faceName}/`,
          base: '_wavefont',
          templateFiles: '_wavefont/*',
          data: { face, masters, axes, clips }
        },
        ...Object.keys(masters).map(name => master({name, ...masters[name]})).flat()
      ]

      // actions to build one master file
      function master({name, weight, align, width, radius}){
        const destination = `${face.name}/${name}.ufo`
        return [
          // ufo skeleton
          {
            type: 'addMany',
            force: true,
            destination: `${destination}/`,
            base: '_wavefont/master.ufo',
            templateFiles: '_wavefont/master.ufo/**/*',
            data: { width, weight, align, radius, axes, face, clips }
          },
          // caps
          {
            force: true,
            type: 'add',
            path: `${destination}/glyphs/cap.glif`,
            template: cap({height: radius*.01*weight*2, width:0, radius: radius*.01*weight, weight, name: 'cap', align: 0 })
          },
          // values
          ...face.values.map((code, value) => ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.glif`,
            template: bar({value, code, weight, width, name: `_${value}`, capSize: radius*.01*weight, align })
          })),
          // substitute glyphs lower than max weight to compensate wrong interpolation on weight clipping
          // the logic: big weights would have big radius, but since it's limited to value, we interpolate between wrong 1 weight and max weight
          ...clips.map((code, value) => value && ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.clip.glif`,
            template: cap({height: upm(value), weight, width, name: `_${value}.clip`, radius: (radius && 1 ) * upm(value) * .5, align })
          })).filter(Boolean)
        ]
      }

      // cap glyph builder
      function cap({width, weight, height, name, code, radius:R, align}) {
        // bezier curve shift to approximate border-radius
        const Rc = R * (1 - .55), yshift = (UPM - height) * align, l = 0, r = weight

        return dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <glyph name="${name}" format="2">
            <advance width="${width}"/>
            ${code ? `<unicode hex="{{hex ${code} }}"/>` : ``}
            <outline>
              <contour>
                  <point x="{{int ${l}}}" y="{{int ${height-Rc + yshift} }}"/>

                  <point x="{{int ${l+Rc} }}" y="{{int ${height + yshift} }}"/>
                  <point x="{{int ${l+R} }}" y="{{int ${height + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${r-R} }}" y="{{int ${height + yshift} }}" type="line"/>
                  <point x="{{int ${r-Rc} }}" y="{{int ${height + yshift} }}"/>

                  <point x="{{int ${r} }}" y="{{int ${height-Rc + yshift} }}"/>
                  <point x="{{int ${r} }}" y="{{int ${height-R + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${r} }}" y="{{int ${R + yshift} }}" type="line"/>
                  <point x="{{int ${r} }}" y="{{int ${Rc + yshift} }}"/>

                  <point x="{{int ${r-Rc} }}" y="{{int ${0 + yshift} }}"/>
                  <point x="{{int ${r-R} }}" y="{{int ${0 + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${l+R} }}" y="{{int ${0 + yshift} }}" type="line"/>
                  <point x="{{int ${l+Rc} }}" y="{{int ${0 + yshift} }}"/>

                  <point x="{{int ${l} }}" y="{{int ${Rc + yshift} }}"/>
                  <point x="{{int ${l} }}" y="{{int ${R + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${l} }}" y="{{int ${height-R + yshift} }}" type="line"/>
              </contour>
            </outline>
          </glyph>
        `
      }

      // bar glyph builder
      function bar({value, code, width, weight, capSize, name, align}) {
        const yshift = upm((face.max - value) * align), l = 0, r = weight
        return dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <glyph name="${name}" format="2">
            <advance width="${width}"/>
            ${code ? `<unicode hex="{{hex ${code} }}"/>` : ``}
            ${face.alias[value]?.map(code => `<unicode hex="{{hex ${code} }}"/>`).join('') || ``}
            ${value ? `<outline>
              <component base="cap" xOffset="0" yOffset="{{int ${yshift}}}" />
              <component base="cap" xOffset="0" yOffset="{{int ${upm(value) - capSize*2 + yshift}}}" />
              <contour>
                <point x="{{int ${l}}}" y="{{int ${yshift + capSize}}}" type="line"/>
                <point x="{{int ${l}}}" y="{{int ${upm(value) + yshift - capSize}}}" type="line"/>
                <point x="{{int ${r}}}" y="{{int ${upm(value) + yshift - capSize}}}" type="line"/>
                <point x="{{int ${r}}}" y="{{int ${yshift + capSize}}}" type="line"/>
              </contour>
            </outline>` : ``}
          </glyph>
        `
      }
    }
  });
}
