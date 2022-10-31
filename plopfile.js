const dedent = require('dedent')

// unicode range starts for low-align and center-align
const LOW_SHIFT = 0x100
const CENTER_SHIFT = 0x400

// const UPM = 2048
const UPM = 1000

// not used since all chars are going to be blank anyways
const ZERO_CHAR = ` \t\`@`.split('').map(v=>v.charCodeAt(0)) //[0x09,0x0a,0x0b,0x0c,0x0d,0x20,0x85,0xa0,0x1680,0x180e,0x2000,0x2001,0x2002,0x2003,0x2004,0x2005,0x2006,0x2007,0x2008,0x2009,0x200a,0x200b,0x200c,0x200d,0x2028,0x2029,0x202f,0x205f,0x2060,0x2061,0x2062,0x3000,0xfeff].map(String.fromCharCode)

const ONE_CHAR = `.-–—―*_`.split('').map(v=>v.charCodeAt(0)) //`.-–—―_¯ˉˍ˗‐‑‒‾⁃⁻₋−⎯⏤─➖⸺⸻𐆑`

const MAX_CHAR = [`|`].map(v=>v.charCodeAt(0)) //`|｜ǀ∣│।`

const BAR_CHAR = `▁▂▃▄▅▆▇█`.split('').map(v=>v.charCodeAt(0))

const FONTFACE = {
  wavefont100: {
    name: 'wavefont100',
    min: 0,
    max: 100,
    alias: {
      1: [...ONE_CHAR, BAR_CHAR[0]],
      14: [BAR_CHAR[1]], 28: [BAR_CHAR[2]], 42: [BAR_CHAR[3]], 56: [BAR_CHAR[4]], 72: [BAR_CHAR[5]], 86: [BAR_CHAR[6]],
      100: [...MAX_CHAR, BAR_CHAR[7]]
    },
    values: Array.from({length: 108}).map((v,i)=>(LOW_SHIFT + i))
  }
}
FONTFACE.wavefont100.values.center = Array.from({length: 108}).map((v,i)=>(CENTER_SHIFT + i))

// 0-9
'0123456789'.split('').map((c,i) => alias(i*10, c))

// a-zA-Z
// alias(1,'a'), alias(2,'b'), alias(4,'c'),
// FIXME: adding this alias breaks OTF in some reason, likely an OTF bug
// alias(6,'d')
// alias(8,'e'), alias(10,'f'), alias(12,'g'), alias(14,'h'), alias(16,'i'), alias(18,'j'), alias(20,'k'), alias(22,'l'), alias(24,'m'), alias(26,'n'), alias(28,'o'), alias(30,'p'), alias(32,'q'), alias(34,'r'),
// alias(36,'s')
// , alias(38,'t')
// FIXME: adding this spoils clipping both in OTF and TTF
// turns out ý = y +  ́, which inserts these two chars as autoligature
// alias(40,'u')
// alias(42,'v'), alias(44,'w'), alias(46,'x')
// alias(48,'y'), alias(50,'z')
// alias(52,'A'), alias(54,'B'), alias(56,'C'), alias(58,'D'), alias(60,'E'), alias(62,'F'), alias(64,'G'), alias(66,'H'), alias(68,'I'), alias(70,'J'), alias(72,'K'), alias(74,'L'), alias(76,'M'), alias(78,'N'), alias(80,'O'), alias(82,'P'), alias(84,'Q'), alias(86,'R'), alias(88,'S'), alias(90,'T'), alias(92,'U'), alias(94,'V'), alias(96,'W'), alias(98,'X'), alias(99,'Y'), alias(100,'Z')

// add alias to wavefont100
function alias(value, char) {
  (FONTFACE.wavefont100.alias[value]||=[]).push(char.charCodeAt(0))
}

const AXES = {
  width: {tag: 'wdth', min: 1, max: 1000, default: 1},
  weight: {tag: 'wght', min: 1, max: 400, default: 1},
  radius: {tag: 'soft', min: 0, max: 50, default: 0}
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
      const {width, weight, radius} = axes

      // clip values are more horizontal than vertical - need alternative glyph
      const clips = face.values.filter((c, v) => upm(v) < AXES.width.max)

      // create master cases
      const masters = {}
      const k = (w=1,b,r) => `w${w}b${b}r${r}`, v = (w=1,b,r) => ({width:w, weight:b, radius:r})
      masters[k(width.min, weight.min, radius.min)] = v(width.min, weight.min, radius.min)
      masters[k(width.min, weight.min, radius.max)] = v(width.min, weight.min, radius.max)
      masters[k(width.min, weight.max, radius.min)] = v(width.min, weight.max, radius.min)
      masters[k(width.min, weight.max, radius.max)] = v(width.min, weight.max, radius.max)
      masters[k(width.max, weight.min, radius.min)] = v(width.max, weight.min, radius.min)
      masters[k(width.max, weight.min, radius.max)] = v(width.max, weight.min, radius.max)
      masters[k(width.max, weight.max, radius.min)] = v(width.max, weight.max, radius.min)
      masters[k(width.max, weight.max, radius.max)] = v(width.max, weight.max, radius.max)

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
      function master({name, weight, width, radius}){
        const destination = `${face.name}/${name}.ufo`

        return [
          // ufo skeleton
          {
            type: 'addMany',
            force: true,
            destination: `${destination}/`,
            base: '_wavefont/master.ufo',
            templateFiles: '_wavefont/master.ufo/**/*',
            data: { width, weight, radius, axes, face, clips }
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
            template: bar({value, code, weight, width, name: `_${value}`, capSize: radius*.01*weight, align: 0, alias: face.alias[value] })
          })),
          // substitute glyphs lower than max weight to compensate wrong interpolation on weight clipping
          // the logic: big weights would have big radius, but since it's limited to value, we interpolate between wrong 1 weight and max weight
          ...clips.map((code, value) => value && ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.clip.glif`,
            template: cap({height: upm(value), weight, width, name: `_${value}.clip`, radius: (radius && 1 ) * upm(value) * .5, align: 0 })
          })).filter(Boolean),

          // centered values in cyrillic range
          ...face.values.center.map((code, value) => ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.center.glif`,
            template: bar({value, code, weight, width, name: `_${value}.center`, capSize: radius*.01*weight, align: 0.5 })
          })),
          ...clips.map((code, value) => value && ({
            force: true,
            type: 'add',
            path: `${destination}/glyphs/${value}.clip.center.glif`,
            template: cap({height: upm(value), weight, width, name: `_${value}.clip.center`, radius: (radius && 1 ) * upm(value) * .5, align: 0.5 })
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
      function bar({value, code, width, weight, capSize, name, align, alias}) {
        const yshift = upm((face.max - value) * align), l = 0, r = weight
        return dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <glyph name="${name}" format="2">
            <advance width="${width}"/>
            ${code ? `<unicode hex="{{hex ${code} }}"/>` : ``}
            ${alias?.map(code => `<unicode hex="{{hex ${code} }}"/>`).join('') || ``}
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
