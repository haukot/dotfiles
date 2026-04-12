#!/bin/bash
#
# Session startup script.
# Launches apps and places them on workspaces using wmctrl.
#
# Workspace layout (0-indexed):
#   0 -> Chrome (restored session)
#   2 -> Terminal + Emacs
#   3 -> Telegram
#   4 -> Vivaldi
#
# Dependencies: wmctrl (sudo apt install wmctrl)

# Wait for GNOME Shell / PaperWM to be ready
sleep 3

wait_for_window() {
    local class="$1"
    local timeout="${2:-30}"
    local i=0
    while [ $i -lt $timeout ]; do
        if wmctrl -lx | grep -qiE "$class"; then
            return 0
        fi
        sleep 1
        i=$((i + 1))
    done
    echo "Timeout waiting for $class" >&2
    return 1
}

move_to_workspace() {
    local class="$1"
    local workspace="$2"
    wmctrl -lx | grep -iE "$class" | awk '{print $1}' | while read wid; do
        wmctrl -i -r "$wid" -t "$workspace"
    done
}

google-chrome-stable --restore-last-session &
gnome-terminal --working-directory=/home/haukot/programming/projects/slurm/slurm -- tmux &
telegram-desktop &
vivaldi-stable &

wait_for_window "google-chrome" && move_to_workspace "google-chrome" 0
wait_for_window "Gnome-terminal" && move_to_workspace "Gnome-terminal" 2
~/dotfiles/ec /home/haukot/programming/projects/slurm/slurm/Gemfile &
wait_for_window "emacs\\.Emacs" && move_to_workspace "emacs\\.Emacs" 2
wait_for_window "TelegramDesktop" && move_to_workspace "TelegramDesktop" 3
wait_for_window "Vivaldi-stable" && move_to_workspace "Vivaldi-stable" 4
