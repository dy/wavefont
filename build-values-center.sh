#!/usr/bin/env bash

offset=256

# FIXME: fallback to default or show error
width=$1

height=100
max=128

for((i=0;i<=max;i++))
  do
    ((baseline= $height / 2))
    ((bottom= $baseline - ($i+1) / 2))
    ((top= $baseline + ($i) / 2))
    ((charCode= $offset + $i))
    hex=$(printf '0%x' $charCode)
    echo "Creating $i.glif"
    echo '<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="'$width'"/>
  <unicode hex="'$hex'"/>
  <outline>
    <contour>
      <point x="0" y="'$top'" type="line"/>
      <point x="'$width'" y="'$top'" type="line"/>
      <point x="'$width'" y="'$bottom'" type="line"/>
      <point x="0" y="'$bottom'" type="line"/>
    </contour>
  </outline>
  <anchor name="entry" x="0" y="'$baseline'"/>
  <anchor name="exit" x="'$width'" y="'$baseline'"/>
</glyph>' > "$PWD/masters/${width}_center.ufo/glyphs/$i.glif"
  done
