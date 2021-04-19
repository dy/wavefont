// FIXME: make tree-like aliases?
const FONTFACE = {
  wavefont10: {
    min: 0,
    max: 10,
    clip: 11,
    values: Array.from({length:10}, (v,i) => ({value: i, code: 0x30 + i}))
  },

  wavefont100: {
    min: 0, max: 100, clip: 108,
    values: Array.from({length: 108}).map((v,i)=>({value: i, code: 0x0100 + i}))
  }
}

const UPM = 2048

// Axes
// Note: values in terms of UPM, not values
const WIDTH = [1,10]
const WEIGHT = [20,500]
const ALIGN = [0, 1]
const RADIUS = [0, 50]
const AMP = [0, 1]


module.exports = function (plop) {
  // FIXME: pass values & real max value
  // const values = values100.map(({value, code}) => ({
  //   value, code,
  //   upmValue:(value*UPM/MAX_VALUE).toFixed(0),
  //   clip: !!value && value < WIDTH[1]
  // }))

  // 1 → uni0001
  plop.setHelper('uni', (arg) => Array.isArray(arg) ? arg.map(arg => `u${hex(parseInt(arg))}`).join(',') : `u${hex(parseInt(arg))}`);

  // sub 1 2 → -1
  plop.setHelper('sub', (a,b) => a-b);

  // half 1 → .5
  plop.setHelper('half', (a) => a*.5);

	plop.setGenerator('build-ufo', {
    description: 'Build master values',
    prompts: [{name: 'faceName', message: 'font-face name', type: 'text'}],
		actions: ({faceName}) => {
      const fontFace = FONTFACE[faceName]

      const masters = [
        {width: WIDTH[0], weight: WEIGHT[0]},
        {width: WIDTH[1], weight: WEIGHT[0]},
        {width: WIDTH[0], weight: WEIGHT[1]},
        {width: WIDTH[1], weight: WEIGHT[1]},
      ]

      return [
        // populate skeleton
        {
          type: 'addMany',
          force: true,
          verbose: false,
          destination: `${faceName}.ufo/`,
          base: '_wavefontX.ufo',
          templateFiles: '_wavefontX.ufo/*',
          data: { }
        },
        // populate masters
        // ...masters.map(master)
      ].flat()
    }
  });

  // create actions to build one master file
  function master({values, width, weight, amp}){
    const destination = `wavefont/wgth${weight}_wdth${width}.ufo`
    return [
      // populate ufo skeleton
      {
        type: 'addMany',
        force: true,
        verbose: false,
        destination: `${destination}/`,
        base: '_wavefontX.ufo/master.ufo',
        templateFiles: '_wavefontX.ufo/master.ufo/**/*',
        data: { width, weight, values }
      },
      // value data points
      ...values.map(({code, value}) => ({
        verbose: false,
        force: true,
        type: 'add',
        path: `${destination}/glyphs/${value}.glif`,
        template: glyph({value, width, align, code, maxValue, maxWidth, radius: (radius && 1) * width*.5})
      })),
      // substitute glyphs lower than max width to compensate wrong interpolation on width clipping
      // the logic: big widths would have big radius, but since it's limited to value, we interpolate between wrong 1 width and max width
      ...values.filter(({clip}) => clip).map(({value}) => ({
        verbose: false,
        force: true,
        type: 'add',
        path: `masters/${width}_${align}_${radius}.ufo/glyphs/${value}.clip.glif`,
        template: glyph({value, width, align, maxValue, maxWidth, radius: (radius && 1) * value*.5})
      }))
    ]
  }

  function glyph({value, width, align, code, maxValue, radius, maxWidth}) {
    const baseline=align * maxValue,
          R=radius,
          // bezier curve shift to approximate border-radius
          Rc = R * (1 - .55),
          // alignment constant shift
          Ca = (maxValue - value) * align,
          fold = maxWidth * 2

    return `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="${upm(width)}"/>
  ${code ? `<unicode hex="${hex(code)}"/>` : ``}
  ${value ? `<outline>
    ${
      // use overlap strategy for glyphs over double-maxWidth
      // value > fold ?
      // `<component base="_${fold}" yOffset="${upm(Ca)}"/><component base="_${fold}" yOffset="${upm(value-fold + Ca)}"/>`
      // :
      `<contour>
      <point x="0" y="${upm(value-Rc + Ca)}"/>

      <point x="${upm(Rc)}" y="${upm(value + Ca)}"/>
      <point x="${upm(R)}" y="${upm(value + Ca)}" type="curve" smooth="yes"/>
      <point x="${upm(width-R)}" y="${upm(value + Ca)}" type="line"/>
      <point x="${upm(width-Rc)}" y="${upm(value + Ca)}"/>

      <point x="${upm(width)}" y="${upm(value-Rc + Ca)}"/>
      <point x="${upm(width)}" y="${upm(value-R + Ca)}" type="curve" smooth="yes"/>
      <point x="${upm(width)}" y="${upm(R + Ca)}" type="line"/>
      <point x="${upm(width)}" y="${upm(Rc + Ca)}"/>

      <point x="${upm(width-Rc)}" y="${upm(Ca)}"/>
      <point x="${upm(width-R)}" y="${upm(Ca)}" type="curve" smooth="yes"/>
      <point x="${upm(R)}" y="${upm(Ca)}" type="line"/>
      <point x="${upm(Rc)}" y="${upm(Ca)}"/>

      <point x="0" y="${upm(Rc + Ca)}"/>
      <point x="0" y="${upm(R + Ca)}" type="curve" smooth="yes"/>
      <point x="0" y="${upm(value-R + Ca)}" type="line"/>
      </contour>`}
  </outline>` : ``}
</glyph>`
  }
}


// convert value to units-per-em (0-100 → 0-2048)
const upm = (v) => (v * 20.48).toFixed(0)

const hex = (v) => v.toString(16).toUpperCase().padStart(4,0)
