module.exports = function (plop) {
	plop.setGenerator('build-ufo', {
    description: 'Build master values',
    prompts: [],
		actions: [
      // cleanup designspace
      {type: "modify", path:"masters/wavefont.designspace", pattern:/<sources>([^]*?)<\/sources>/i, template: '<sources></sources>'},

      ...master({number: 128, max: 100, align: 0, width: 1, radius: 20}),
      ...master({number: 128, max: 100, align: 1, width: 1, radius: 20}),
      ...master({number: 128, max: 100, align: 0, width: 100, radius: 20}),
      ...master({number: 128, max: 100, align: 1, width: 100, radius: 20})
    ]
	});
};

// generate actions to build one master file
function master({number, max=100, align, width, radius}){
  const offset = 0x0100
  const values = Array.from({length: number+1}).map((v,i)=>i)

  return [
    {
      type: 'addMany',
      force: true,
      destination: `masters/${width}_${align}.ufo/`,
      base: 'masters/_template.ufo',
      templateFiles: 'masters/_template.ufo/**/*',
      data: { width, baseline: max * align, max, values }
    },
    {
      type: "modify",
      path: "masters/wavefont.designspace",
      pattern: '</sources>',
      template: `
        <source familyname="Wavefont" filename="${width}_${align}.ufo" name="Master_${width}_${align}" stylename="Master ${width}_${align}">
            <location>
                <dimension name="width" xvalue="${width}" />
                <dimension name="align" xvalue="${align}" />
            </location>
        </source></sources>`
    },
    ...values.map((value) => {
      return {
        force: true,
        type: 'add',
        path: `masters/${width}_${align}.ufo/glyphs/${value}.glif`,
        template: glyph({value, width, align, code: offset + value, max, radius: Math.min(radius, width*.5, value*.5)})
      }
    })
  ]
}


const glyph = ({value, width, align, code, max, radius:R}, baseline=align*max) => console.log(value, R) || `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="${width}"/>
  <unicode hex="${code.toString(16).padStart(4,0)}"/>
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
      // align === 0 ?
      // `
      // <point x="0" y="${0}" type="line"/>
      // <point x="0" y="${value}" type="line"/>
      // <point x="${width}" y="${value}" type="line"/>
      // <point x="${width}" y="${0}" type="line"/>
      // `
      // :
      // `
      // <point x="0" y="${max - value}" type="line"/>
      // <point x="0" y="${max}" type="line"/>
      // <point x="${width}" y="${max}" type="line"/>
      // <point x="${width}" y="${max - value}" type="line"/>
      // `
    }</contour>
  </outline>
  <anchor name="entry" x="0" y="${baseline}"/>
  <anchor name="exit" x="${width}" y="${baseline}"/>
</glyph>`
