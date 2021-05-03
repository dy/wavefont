const dedent = require('dedent')

// const UPM = 2048
const UPM = 1000

const ZERO_CHAR = ` \t`.split('').map(v=>v.charCodeAt(0)) //[0x09,0x0a,0x0b,0x0c,0x0d,0x20,0x85,0xa0,0x1680,0x180e,0x2000,0x2001,0x2002,0x2003,0x2004,0x2005,0x2006,0x2007,0x2008,0x2009,0x200a,0x200b,0x200c,0x200d,0x2028,0x2029,0x202f,0x205f,0x2060,0x2061,0x2062,0x3000,0xfeff].map(String.fromCharCode)

const ONE_CHAR = `.-_`.split('').map(v=>v.charCodeAt(0)) //`.-–—―_¯ˉˍ˗‐‑‒‾⁃⁻₋−⎯⏤─➖⸺⸻𐆑`

const MAX_CHAR = [`|`].map(v=>v.charCodeAt(0)) //`|｜ǀ∣│।`

const BAR_CHAR = `▁▂▃▄▅▆▇█`.split('').map(v=>v.charCodeAt(0))

const ASCII_CHAR = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`.split('').map(v=>v.charCodeAt(0))

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
      10: [...ONE_CHAR, 49],
      20: [50], 30: [51], 40: [52], 50: [53], 60: [54], 70: [55], 80: [56], 90: [57],
      100: [...MAX_CHAR]
    },
    values: Array.from({length: 108}).map((v,i)=>(0x0100 + i))
  },

  wavefont255: {
    name: 'wavefont255',
    min: 0, max: 255,
    values: Array.from({length: 255})
  },

  wavefont1000: {
    name: 'wavefont1000',
    min: 0, max: 1000,
    values: Array.from({length: 1024})
  }
}

module.exports = function (plop) {
	plop.setGenerator('build-ufo', {
    description: 'Build font-face UFOs',
    prompts: [{name: 'faceName', message: 'font-face name', type: 'text'}],
		actions: ({faceName}) => {
      const face = FONTFACE[faceName]

      // convert value to units-per-em (0-100 → 0-2048)
      const upm = (v) => (UPM * v / face.max)
      const hex = (v) => v.toString(16).toUpperCase().padStart(4,0)
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

      const axes = {
        width: {tag: 'wdth', min: 1, max: 108, default: 1, clip: face.values.filter((c, v) => upm(v) < 108)},
        align: {tag: 'algn', min: 0, max: 1, default: 0},
        radius: {tag: 'radi', min: 0, max: 50, default: 0}
      }

      const masters = {
        [`w${axes.width.min}a${axes.align.min}r${axes.align.min}`]: {width: axes.width.min, align: axes.align.min, radius: axes.radius.min},
        [`w${axes.width.min}a${axes.align.max}r${axes.align.min}`]: {width: axes.width.min, align: axes.align.max, radius: axes.radius.min},
        [`w${axes.width.max}a${axes.align.min}r${axes.align.min}`]: {width: axes.width.max, align: axes.align.min, radius: axes.radius.min },
        [`w${axes.width.max}a${axes.align.max}r${axes.align.min}`]: {width: axes.width.max, align: axes.align.max, radius: axes.radius.min },
        [`w${axes.width.min}a${axes.align.min}r${axes.align.max}`]: {width: axes.width.min, align: axes.align.min, radius: axes.radius.max },
        [`w${axes.width.min}a${axes.align.max}r${axes.align.max}`]: {width: axes.width.min, align: axes.align.max, radius: axes.radius.max},
        [`w${axes.width.max}a${axes.align.min}r${axes.align.max}`]: {width: axes.width.max, align: axes.align.min, radius: axes.radius.max },
        [`w${axes.width.max}a${axes.align.max}r${axes.align.max}`]: {width: axes.width.max, align: axes.align.max, radius: axes.radius.max},
      }

      return [
        // populate skeleton
        {
          type: 'addMany',
          force: true,
          destination: `${faceName}/`,
          base: '_wavefont',
          templateFiles: '_wavefont/*',
          data: { face, masters, axes }
        },
        ...Object.keys(masters).map(name => master({name, ...masters[name]})).flat()
      ]

      // actions to build one master file
      function master({name, align, width, radius}){
        const destination = `${face.name}/${name}.ufo`
        return [
          // ufo skeleton
          {
            type: 'addMany',
            force: true,
            destination: `${destination}/`,
            base: '_wavefont/master.ufo',
            templateFiles: '_wavefont/master.ufo/**/*',
            data: { axes, width, face }
          },
          // caps
          {
            force: true,
            type: 'add',
            path: `${destination}/glyphs/cap.glif`,
            template: cap({height: radius*.01*width*2, radius: radius*.01*width, width, name: 'cap', align: 0 })
          },
          // values
          ...face.values.map((code, value) => ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.glif`,
            template: bar({value, code, width, name: `_${value}`, capSize: radius*.01*width, align })
          })),
          // substitute glyphs lower than max width to compensate wrong interpolation on width clipping
          // the logic: big widths would have big radius, but since it's limited to value, we interpolate between wrong 1 width and max width
          ...axes.width.clip.map((code, value) => value && ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.clip.glif`,
            template: cap({height: upm(value), width, name: `_${value}.clip`, radius: (radius && 1 ) * upm(value) * .5, align })
          })).filter(Boolean)
        ]
      }

      function cap({width, height, name, code, radius:R, align}) {
        // bezier curve shift to approximate border-radius
        const Rc = R * (1 - .55), yshift = (UPM - height) * align

        return dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <glyph name="${name}" format="2">
            <advance width="${width}"/>
            ${code ? `<unicode hex="{{hex ${code} }}"/>` : ``}
            <outline>
              <contour>
                  <point x="0" y="{{int ${height-Rc + yshift} }}"/>

                  <point x="{{int ${Rc} }}" y="{{int ${height + yshift} }}"/>
                  <point x="{{int ${R} }}" y="{{int ${height + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${width-R} }}" y="{{int ${height + yshift} }}" type="line"/>
                  <point x="{{int ${width-Rc} }}" y="{{int ${height + yshift} }}"/>

                  <point x="{{int ${width} }}" y="{{int ${height-Rc + yshift} }}"/>
                  <point x="{{int ${width} }}" y="{{int ${height-R + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${width} }}" y="{{int ${R + yshift} }}" type="line"/>
                  <point x="{{int ${width} }}" y="{{int ${Rc + yshift} }}"/>

                  <point x="{{int ${width-Rc} }}" y="{{int ${0 + yshift} }}"/>
                  <point x="{{int ${width-R} }}" y="{{int ${0 + yshift} }}" type="curve" smooth="yes"/>
                  <point x="{{int ${R} }}" y="{{int ${0 + yshift} }}" type="line"/>
                  <point x="{{int ${Rc} }}" y="{{int ${0 + yshift} }}"/>

                  <point x="0" y="{{int ${Rc + yshift} }}"/>
                  <point x="0" y="{{int ${R + yshift} }}" type="curve" smooth="yes"/>
                  <point x="0" y="{{int ${height-R + yshift} }}" type="line"/>
              </contour>
            </outline>
          </glyph>
        `
      }

      function bar({value, code, width, capSize, name, align}) {
        const yshift = upm((face.max - value) * align)
        return dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <glyph name="${name}" format="2">
            <advance width="${width}"/>
            ${code ? `<unicode hex="{{hex ${code} }}"/>` : ``}
            ${face.alias[value]?.map(code => `<unicode hex="{{hex ${code} }}"/>`).join('') || ``}
            ${value ? `<outline>
              <component base="cap" yOffset="{{int ${yshift}}}" />
              <component base="cap" yOffset="{{int ${upm(value) - capSize*2 + yshift}}}" />
              <contour>
                <point x="0" y="{{int ${yshift + capSize}}}" type="line"/>
                <point x="0" y="{{int ${upm(value) + yshift - capSize}}}" type="line"/>
                <point x="${width}" y="{{int ${upm(value) + yshift - capSize}}}" type="line"/>
                <point x="${width}" y="{{int ${yshift + capSize}}}" type="line"/>
              </contour>
            </outline>` : ``}
          </glyph>
        `
      }
    }
  });
}

function i(v) {return v}
