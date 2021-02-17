#!/usr/bin/env bash

offset=256

# FIXME: fallback to default or show error
width=$1

for((i=0;i<=100;i++))
  do
    charCode=$(expr $offset + $i)
    hex=$(printf '0%x' $charCode)
    echo "Creating $i.glif"
    echo '<?xml version="1.0" encoding="UTF-8"?>
<glyph name="_" format="2">
  <advance width="'$width'"/>
  <unicode hex="'$hex'"/>
  <outline>
    <contour>
      <point x="0" y="'$i'" type="line"/>
      <point x="'$width'" y="'$i'" type="line"/>
      <point x="'$width'" y="0" type="line"/>
      <point x="0" y="0" type="line"/>
    </contour>
  </outline>
  <anchor name="entry" x="0" y="0"/>
  <anchor name="exit" x="10" y="0"/>
</glyph>' > "$PWD/masters/$width.ufo/glyphs/$i.glif"
  done
