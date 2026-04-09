#!/bin/bash

# This script starts emacs daemon if it is not running, opens whatever file
# you pass in and changes the focus to emacs.  Without any arguments, it just
# opens the current buffer or *scratch* if nothing else is open.

# Pass through raw emacsclient options unchanged.
if [ $# -gt 0 ] && [[ "$1" == -* ]]; then
  exec emacsclient -a "" "$@"
fi

# Number of current visible frames,
# Emacs daemon always has a visible frame called F1
visible_frames() {
  emacsclient -a "" -e '(length (visible-frame-list))'
}

# try switching to the frame incase it is just minimized
# will start a server if not running
test "$(visible_frames)" -eq "1"

# Build elisp to open frame with files
if [ $# -eq 0 ]; then
  emacsclient -e '(ec-open-frame)' > /dev/null 2>&1 &
else
  args=""
  for f in "$@"; do
    abs=$(realpath "$f" 2>/dev/null || echo "$f")
    args="$args \"$abs\""
  done
  emacsclient -e "(ec-open-frame$args)" > /dev/null 2>&1 &
fi
