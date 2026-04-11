#!/bin/sh
LAYOUT="$1"
LABEL="$2"
COLOR="$3"

export DISPLAY=:0
export XAUTHORITY=/home/haukot/.Xauthority

keyd do setlayout "$LAYOUT"
echo "$LABEL" | osd_cat -d 1 -p middle -A center -s 5 -c "$COLOR" &
