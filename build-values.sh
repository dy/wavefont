offset=256

for((i=0;i<10;i++))
  do
    charCode=$(expr $offset + $i)
    hex=$(printf '0%x' $charCode)
    # touch "$PWD/wavefont.ufo/glyphs/${i}.glif"
    # echo "${hex}" > "./glyphs/${i}.glif"
    echo '<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="10"/>
  <unicode hex="'${hex}'"/>
  <outline>
    <contour>
      <point x="0" y="'${i}'0" type="line"/>
      <point x="10" y="'${i}'0" type="line"/>
      <point x="10" y="0" type="line"/>
      <point x="0" y="0" type="line"/>
    </contour>
  </outline>
</glyph>' > "$PWD/wavefont.ufo/glyphs/${i}.glif"
  done
