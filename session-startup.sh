#!/bin/bash
#
# Session startup script.
# Launches apps from their target workspaces using wmctrl.
#
# Workspace layout:
#   1 -> Chrome (restored session)
#   3 -> Terminal + Emacs
#   4 -> Telegram
#   5 -> Vivaldi
#   6 -> Terminal
#   7 -> Terminal
#   8 -> Terminal
#
# Dependencies: wmctrl (sudo apt install wmctrl)

# Wait for GNOME Shell / PaperWM to be ready
sleep 3

CHROME_USER_DATA_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/google-chrome"
CHROME_PROFILE="Default"

list_windows() {
    local class="$1"
    wmctrl -lx | awk -v pat="$class" 'BEGIN { IGNORECASE = 1 } $0 ~ pat { print $1 }'
}

contains_window() {
    local needle="$1"
    shift

    for wid in "$@"; do
        [ "$wid" = "$needle" ] && return 0
    done

    return 1
}

launch_on_workspace() {
    local workspace="$1"
    local class="$2"
    shift
    shift
    local before=()
    local wmctrl_workspace=$((workspace - 1))
    local wid

    mapfile -t before < <(list_windows "$class")

    wmctrl -s "$wmctrl_workspace"
    sleep 1
    "$@" &

    while true; do
        while read -r wid; do
            [ -z "$wid" ] && continue
            contains_window "$wid" "${before[@]}" || return 0
        done < <(list_windows "$class")

        sleep 0.2
    done
}

launch_chrome() {
    google-chrome-stable \
        --user-data-dir="$CHROME_USER_DATA_DIR" \
        --profile-directory="$CHROME_PROFILE" \
        --restore-last-session
}

launch_on_workspace 3 "Gnome-terminal" gnome-terminal --working-directory=/home/haukot/programming/projects/slurm/slurm -- tmux
launch_on_workspace 3 "emacs\\.Emacs" ~/dotfiles/ec /home/haukot/programming/projects/slurm/slurm/Gemfile
sleep 1
launch_on_workspace 4 "TelegramDesktop" telegram-desktop
launch_on_workspace 5 "Vivaldi-stable" vivaldi-stable

for ws in 6 7 8; do
    launch_on_workspace "$ws" "Gnome-terminal" gnome-terminal
done

launch_on_workspace 1 "google-chrome" launch_chrome
wmctrl -s 0
