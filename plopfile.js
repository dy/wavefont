// character offset to start from
// FIXME: make tree-like aliases?
// 0-9 for 0, 10, 20,...90                10
const values10 = [{value:0,code:0x30},{value:1,code:0x31},{value:2,code:0x32},{value:3,code:0x33},{value:4,code:0x34},{value:5,code:0x35},{value:6,code:0x36},{value:7,code:0x37},{value:8,code:0x38},{value:9,code:0x39}]
// ⁰-⁹ for absolute offset?
// A-Z for 5, 10, or absolute offset?
// a-z for -5, -10, -15, ... ?            26
// 0x0100-01B0 for 0,1,2,...127          ~176
const values100 = Array.from({length: 128}).map((v,i)=>({value: i, code: i+0x0100}))
// cyrillica                              255
// 0x1400-1680                            ~640
// 0xA000-A490                            ~1168
// 0xE000-F900                            ~6400
// ^_ - relative offset?

const UPM = 2048

// Axes
// Note: values in terms of UPM, not values
const WIDTH = [1,10]
const WEIGHT = [20,500]
const ALIGN = [0, 1]
const RADIUS = [0, 50]

module.exports = function (plop) {
  // FIXME: pass values & real max value
  const VALUE = [0, 100]
  const values = values100.map(({value, code}) => ({
    value, code,
    upmValue:(value*UPM/MAX_VALUE).toFixed(0),
    clip: !!value && value < WIDTH[1]
  }))

  const masters = [
    {values, width: WIDTH[0], weight: WEIGHT[0], amp: 100},
    {values, width: WIDTH[1], weight: WEIGHT[0], amp: 100},
    {values, width: WIDTH[0], weight: WEIGHT[1], amp: 100},
    {values, width: WIDTH[1], weight: WEIGHT[1], amp: 100},
  ]

  // 1 → uni0001
  plop.setHelper('uni', (arg) => Array.isArray(arg) ? arg.map(arg => `u${hex(parseInt(arg))}`).join(',') : `u${hex(parseInt(arg))}`);

  // sub 1 2 → -1
  plop.setHelper('sub', (a,b) => a-b);

  // half 1 → .5
  plop.setHelper('half', (a) => a*.5);

	plop.setGenerator('build-ufo', {
    description: 'Build master values',
    prompts: [{fontface: 10}],
		actions: [
      // populate skeleton
      {
        type: 'addMany',
        force: true,
        verbose: false,
        destination: `wavefont/`,
        base: '_template',
        templateFiles: '_template/*',
        data: { values, masters }
      },
      // populate masters
      ...masters.map(master)
    ].flat()
  })

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
        base: '_template/master.ufo',
        templateFiles: '_template/master.ufo/**/*',
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
