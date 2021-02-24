module.exports = function (plop) {
	plop.setGenerator('build-ufo', {
    description: 'Build master values',
    prompts: [],
		actions: [
      ...master({number: 128, max: 100, align: 0, width: 1}),
      ...master({number: 128, max: 100, align: 1, width: 1}),
      ...master({number: 128, max: 100, align: 0, width: 100}),
      ...master({number: 128, max: 100, align: 1, width: 100})
    ]
	});
};

// generate actions to build one master file
function master({number, max=100, align, width}){
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
    ...values.map((value) => {
      return {
        force: true,
        type: 'add',
        path: `masters/${width}_${align}.ufo/glyphs/${value}.glif`,
        template: glyph({value, width, align, code: offset + value, max})
      }
    })
  ]
}


const glyph = ({value, width, align, code, max}, baseline=align*max) =>`<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="${width}"/>
  <unicode hex="${code.toString(16).padStart(4,0)}"/>
  <outline>
    <contour>${
      align === 0 ?
      `
      <point x="0" y="${0}" type="line"/>
      <point x="0" y="${value}" type="line"/>
      <point x="${width}" y="${value}" type="line"/>
      <point x="${width}" y="${0}" type="line"/>
      ` :
      `
      <point x="0" y="${max - value}" type="line"/>
      <point x="0" y="${max}" type="line"/>
      <point x="${width}" y="${max}" type="line"/>
      <point x="${width}" y="${max - value}" type="line"/>
      `
    }</contour>
  </outline>
  <anchor name="entry" x="0" y="${baseline}"/>
  <anchor name="exit" x="${width}" y="${baseline}"/>
</glyph>`
