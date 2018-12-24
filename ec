#!/bin/bash

# This script starts emacs daemon if it is not running, opens whatever file
# you pass in and changes the focus to emacs.  Without any arguments, it just
# opens the current buffer or *scratch* if nothing else is open.  The following
# example will open ~/.bashrc

# ec ~/.bashrc

emacsclient -n -c "$@"
