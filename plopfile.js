module.exports = function (plop) {
  const values = Array.from({length: 129}).map((v,i)=>i)
  const offset = 0x0100

	plop.setGenerator('build-ufo', {
    description: 'Build master values',
    prompts: [],
		actions: [
      // cleanup designspace
      {type: "modify", path:"masters/wavefont.designspace", pattern:/<sources>([^]*?)<\/sources>/i, template: '<sources></sources>'},

      ...master({values, max: 100, align: 0, width: 1, radius: 0, offset}),
      // ...master({values, max: 100, align: 1, width: 1, radius: 0, offset}),
      // ...master({values, max: 100, align: 0, width: 1, radius: 50, offset}),
      // ...master({values, max: 100, align: 1, width: 1, radius: 50, offset}),

      ...master({values, max: 100, align: 0, width: 25, radius: 0, offset}),
      // ...master({values, max: 100, align: 1, width: 25, radius: 0, offset}),
      // ...master({values, max: 100, align: 0, width: 25, radius: 50, offset}),
      // ...master({values, max: 100, align: 1, width: 25, radius: 50, offset}),

      // modify GlyphsOrderAndAlias
      {type: "modify", path:"masters/GlyphOrderAndAliasDB", pattern:/#values[^]*#\/values/i, template: `#values\n${
        values.map(v => `_${v}\t_${v}\tuni${hex(v + offset)}`).join('\n')
      }\n#/values`}
    ]
	});
};

// generate actions to build one master file
function master({values, max=100, align, width, radius, offset}){
  return [
    // populate ufo skeleton
    {
      type: 'addMany',
      force: true,
      verbose: false,
      destination: `masters/${width}_${align}_${radius}.ufo/`,
      base: 'masters/_template.ufo',
      templateFiles: 'masters/_template.ufo/**/*',
      data: { width, baseline: max * align, max, values }
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
    ...values.map((value) => {
      return {
        verbose: false,
        force: true,
        type: 'add',
        path: `masters/${width}_${align}_${radius}.ufo/glyphs/${value}.glif`,
        template: glyph({value, width, align, code: offset + value, max, radius})
      }
    })
  ]
}


const glyph = ({value, width, align, code, max, radius}) => {
  const baseline=align*max,
        R=Math.min(width*.5,value*.5),
        // R=5,
        // R=value*.5,
        // R=width*.5,
        shift = max - value

  return `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="${width}"/>
  <unicode hex="${hex(code)}"/>
  <outline>
    <contour>${
      `
      <point x="0" y="${value-R}" type="line" smooth="yes"/>
      <point x="0" y="${value-R*.45}"/>

      <point x="${R*.45}" y="${value}"/>
      <point x="${R}" y="${value}" type="curve" smooth="yes"/>
      <point x="${width-R}" y="${value}" type="line" smooth="yes"/>
      <point x="${width-R*.45}" y="${value}"/>

      <point x="${width}" y="${value-R*.45}"/>
      <point x="${width}" y="${value-R}" type="curve" smooth="yes"/>
      <point x="${width}" y="${R}" type="line" smooth="yes"/>
      <point x="${width}" y="${R*.45}"/>

      <point x="${width-R*.45}" y="0"/>
      <point x="${width-R}" y="0" type="curve" smooth="yes"/>
      <point x="${R}" y="0" type="line" smooth="yes"/>
      <point x="${R*.45}" y="0"/>

      <point x="0" y="${R*.45}"/>
      <point x="0" y="${R}" type="curve" smooth="yes"/>
      `
    }</contour>
  </outline>
  <anchor name="entry" x="0" y="${baseline}"/>
  <anchor name="exit" x="${width}" y="${baseline}"/>
</glyph>`
}


const hex = (v) => v.toString(16).toUpperCase().padStart(4,0)
