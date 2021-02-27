// character offset to start from
// FIXME: make tree-like aliases?
// 0-9 for 0, 10, 20,...90                10
// ⁰-⁹ for absolute offset?
// A-Z for 5, 10, or absolute offset?
// a-z for -5, -10, -15, ... ?            26
// 0x0100-01B0 for 0,1,2,...128          ~176
const values100 = Array.from({length: 129}).map((v,i)=>({value: i, code: i+0x0100}))
// cyrillica                              255
// 0x1400-1680                            ~640
// 0xA000-A490                            ~1168
// 0xE000-F900                            ~6400
// ^_ - relative offset?


module.exports = function (plop) {
  const maxWidth = 20
  const maxValue = 100
  const values = values100.map(({value, code}) => ({value, code, clip: !!value && value < maxWidth}))

	plop.setGenerator('build-ufo', {
    description: 'Build master values',
    prompts: [],
		actions: [
      // cleanup designspace
      {type: "modify", path:"masters/wavefont.designspace", pattern:/<sources>([^]*?)<\/sources>/i, template: '<sources></sources>'},
      {type: "modify", path:"masters/wavefont.designspace", pattern:/<rules>([^]*?)<\/rules>/i, template: '<rules></rules>'},

      ...master({values, maxValue, maxWidth, align: 0, width: 1, radius: 0}),
      ...master({values, maxValue, maxWidth, align: 1, width: 1, radius: 0}),
      ...master({values, maxValue, maxWidth, align: 0, width: 1, radius: 50}),

      ...master({values, maxValue, maxWidth, align: 0, width: maxWidth, radius: 0}),
      ...master({values, maxValue, maxWidth, align: 1, width: maxWidth, radius: 0}),
      ...master({values, maxValue, maxWidth, align: 0, width: maxWidth, radius: 50}),

      // write clipping glyphs rules
      {type: "modify", path:"masters/wavefont.designspace", pattern:/<rules>([^]*?)<\/rules>/i, template: `<rules>${
        values.filter(({clip})=>clip).map(({value}) => `
        <rule name="clip">
            <conditionset><condition minimum="${value}" maximum="${maxWidth}" name="width" /></conditionset>
            <sub name="_${value}" with="_${value}.clip"/>
        </rule>`).join('')
      }</rules>`},

      // write GlyphsOrderAndAlias
      {type: "modify", path:"masters/GlyphOrderAndAliasDB", pattern:/#values[^]*#\/values/i, template: `#values\n${
        values.map(({code, value}) => `_${value}\t_${value}\tuni${hex(code)}`).join('\n')
      }\n${
        values.filter(({clip}) => clip).map(({value}) => `_${value}.clip\t_${value}.clip`).join('\n')
      }\n#/values`}
    ]
	});
};

// create actions to build one master file
function master({values, maxValue, maxWidth, align, width, radius}){
  return [
    // populate ufo skeleton
    {
      type: 'addMany',
      force: true,
      verbose: false,
      destination: `masters/${width}_${align}_${radius}.ufo/`,
      base: 'masters/_template.ufo',
      templateFiles: 'masters/_template.ufo/**/*',
      data: { width: upm(width), baseline: upm(maxValue * align), maxValue: upm(maxValue), values, step: upm(1) }
    },
    // append master
    {
      type: "modify",
      path: "masters/wavefont.designspace",
      pattern: '</sources>',
      template: `
        <source familyname="Wavefont" filename="${width}_${align}_${radius}.ufo" name="Master_${width}_${align}_${radius}" stylename="Master ${width}_${align}_${radius}">
            <location>
                <dimension name="width" xvalue="${width}" />
                <dimension name="align" xvalue="${align}" />
                <dimension name="radius" xvalue="${radius}" />
            </location>
        </source></sources>`
    },
    ...values.map(({code, value}) => ({
      verbose: false,
      force: true,
      type: 'add',
      path: `masters/${width}_${align}_${radius}.ufo/glyphs/${value}.glif`,
      template: glyph({value, width, align, code, maxValue, radius: (radius && 1) * width*.5})
    })),
    // substitute glyphs lower than max width to compensate wrong interpolation on width clipping
    // the logic: big widths would have big radius, but since it's limited to value, we interpolate between wrong 1 width and max width
    ...values.filter(({clip}) => clip).map(({value}) => ({
      verbose: false,
      force: true,
      type: 'add',
      path: `masters/${width}_${align}_${radius}.ufo/glyphs/${value}.clip.glif`,
      template: glyph({value, width, align, maxValue, radius: (radius && 1) * value*.5})
    }))
  ]
}


const glyph = ({value, width, align, code, maxValue, radius}) => {
  const baseline=align * maxValue,
        R=radius,
        // bezier curve shift to approximate border-radius
        Rc = R * (1 - .55),
        // alignment constant shift
        Ca = (maxValue - value) * align

  return `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="${upm(width)}"/>
  ${code ? `<unicode hex="${hex(code)}"/>` : ``}
  ${value ? `<outline>
    <contour>${
      `
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
      `
    }</contour>
  </outline>` : ``}
  ${
    ``// `<anchor name="entry" x="0" y="${upm(baseline)}"/><anchor name="exit" x="${upm(width)}" y="${upm(baseline)}"/>`
  }
</glyph>`
}

// convert value to units-per-em (0-100 → 0-2048)
const upm = (v) => (v * 20.48).toFixed(0)

const hex = (v) => v.toString(16).toUpperCase().padStart(4,0)
