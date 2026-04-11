#!/bin/sh
# Layout indicator for keyd using osd_cat
# Also switches XKB layout via setxkbmap

OSD_OPTS="-d 1 -p middle -A center -s 5 -c white -O 2 -u black -f -*-*-bold-*-*-*-72-*-*-*-*-*-*-*"

keyd listen | while read -r line; do
    case "$line" in
        /ru)
            setxkbmap -layout ru,us
            echo "RU" | osd_cat $OSD_OPTS &
            ;;
        /workman)
            setxkbmap -layout us,ru
            echo "EN" | osd_cat $OSD_OPTS &
            ;;
    esac
done
