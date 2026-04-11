#!/bin/sh
# Layout indicator for keyd using osd_cat
# Listens for keyd layout changes and shows OSD

OSD_OPTS="-d 1 -p middle -A center -s 5 -c white -O 2 -u black -f -*-*-bold-*-*-*-72-*-*-*-*-*-*-*"

keyd listen | while read -r line; do
    case "$line" in
        /ru)
            echo "RU" | osd_cat $OSD_OPTS &
            ;;
        /workman)
            echo "EN" | osd_cat $OSD_OPTS &
            ;;
    esac
done
