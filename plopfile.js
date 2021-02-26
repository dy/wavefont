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
  const maxWidth = 25
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
      // ...master({values, max: 100, align: 0, width: 1, radius: 50, offset}),
      // ...master({values, max: 100, align: 1, width: 1, radius: 50, offset}),

      ...master({values, maxValue, maxWidth, align: 0, width: maxWidth, radius: 0}),
      ...master({values, maxValue, maxWidth, align: 1, width: maxWidth, radius: 0}),
      // ...master({values, max: 100, align: 1, width: 25, radius: 0, offset}),
      // ...master({values, max: 100, align: 0, width: 25, radius: 50, offset}),
      // ...master({values, max: 100, align: 1, width: 25, radius: 50, offset}),

      // write GlyphsOrderAndAlias
      {type: "modify", path:"masters/GlyphOrderAndAliasDB", pattern:/#values[^]*#\/values/i, template: `#values
      ${
        values.map(({code, value}) => `_${value}\t_${value}\tuni${hex(code)}`).join('\n')
      }
      ${
        values.filter(({clip}) => clip).map(({value}) => `_${value}.clip\t_${value}.clip`).join('\n')
      }
      #/values`}
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
      data: { width, baseline: maxValue * align, maxValue, values }
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
      template: glyph({value, width, align, code, maxValue, radius: width*.5})
    })),
    // substitute glyphs lower than max width to compensate wrong interpolation on width clipping
    // the logic: big widths would have big radius, but since it's limited to value, we interpolate between wrong 1 width and max width
    ...values.filter(({clip}) => clip).map(({value}) => ({
      verbose: false,
      force: true,
      type: 'add',
      path: `masters/${width}_${align}_${radius}.ufo/glyphs/${value}.clip.glif`,
      template: glyph({value, width, align, maxValue, radius: value*.5})
    })),
    ...values.filter(({clip}) => clip).map(({code, value}) => ({
      type: "modify",
      path: "masters/wavefont.designspace",
      pattern: '</rules>',
      template: `
        <rule name="big">
            <conditionset><condition minimum="${value}" maximum="${maxWidth}" name="width" /></conditionset>
            <sub name="_${value}" with="_${value}.clip"/>
        </rule></rules>`
    })),
  ]
}


const glyph = ({value, width, align, code, maxValue, radius}) => {
  const baseline=align * maxValue,
        R=radius,
        // bezier curve shift to approximate border-radius
        Rc = R * (1 - .551),
        // alignment constant shift
        Ca = (maxValue - value) * align

  return `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="${width}"/>
  ${code ? `<unicode hex="${hex(code)}"/>` : ``}
  ${value && `<outline>
    <contour>${
      `
      <point x="0" y="${trim(value-R + Ca)}" type="line" smooth="yes"/>
      <point x="0" y="${trim(value-Rc + Ca)}"/>

      <point x="${trim(Rc)}" y="${trim(value + Ca)}"/>
      <point x="${R}" y="${trim(value + Ca)}" type="curve" smooth="yes"/>
      <point x="${width-R}" y="${trim(value + Ca)}" type="line" smooth="yes"/>
      <point x="${trim(width-Rc)}" y="${trim(value + Ca)}"/>

      <point x="${width}" y="${trim(value-Rc + Ca)}"/>
      <point x="${width}" y="${trim(value-R + Ca)}" type="curve" smooth="yes"/>
      <point x="${width}" y="${trim(R + Ca)}" type="line" smooth="yes"/>
      <point x="${width}" y="${trim(Rc + Ca)}"/>

      <point x="${trim(width-Rc)}" y="${trim(Ca)}"/>
      <point x="${width-R}" y="${trim(Ca)}" type="curve" smooth="yes"/>
      <point x="${R}" y="${trim(Ca)}" type="line" smooth="yes"/>
      <point x="${trim(Rc)}" y="${trim(Ca)}"/>

      <point x="0" y="${trim(Rc + Ca)}"/>
      <point x="0" y="${trim(R + Ca)}" type="curve" smooth="yes"/>
      `
    }</contour>
  </outline>`}
  <anchor name="entry" x="0" y="${trim(baseline)}"/>
  <anchor name="exit" x="${width}" y="${trim(baseline)}"/>
</glyph>`
}

const trim = (v) => v.toPrecision(4)

const hex = (v) => v.toString(16).toUpperCase().padStart(4,0)
