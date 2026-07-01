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
#   6 -> Terminal
#   7 -> Terminal
#   8 -> Terminal
#
# Dependencies: wmctrl (sudo apt install wmctrl)

# Wait for GNOME Shell / PaperWM to be ready
sleep 3

ensure_workspaces() {
    local count="$1"

    # GNOME only keeps high-numbered workspaces reliably when dynamic
    # workspaces are disabled.
    gsettings set org.gnome.mutter dynamic-workspaces false >/dev/null 2>&1 || true
    gsettings set org.gnome.desktop.wm.preferences num-workspaces "$count" >/dev/null 2>&1 || true
}

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

move_new_windows() {
    local class="$1"
    local workspace="$2"
    local timeout="${3:-30}"
    local settle="${4:-4}"
    shift 4
    local before=()
    local moved=()
    local elapsed=0
    local idle=0
    local saw_window=0
    local wid

    mapfile -t before < <(list_windows "$class")
    "$@" &

    while [ "$elapsed" -lt "$timeout" ]; do
        local moved_this_round=0

        while read -r wid; do
            [ -z "$wid" ] && continue
            contains_window "$wid" "${before[@]}" && continue
            contains_window "$wid" "${moved[@]}" && continue

            wmctrl -i -r "$wid" -t "$workspace"
            moved+=("$wid")
            saw_window=1
            moved_this_round=1
        done < <(list_windows "$class")

        if [ "$moved_this_round" -eq 1 ]; then
            idle=0
        elif [ "$saw_window" -eq 1 ]; then
            idle=$((idle + 1))
            [ "$idle" -ge "$settle" ] && return 0
        fi

        sleep 1
        elapsed=$((elapsed + 1))
    done

    echo "Timeout waiting for new $class window" >&2
    return 1
}

ensure_workspaces 9

move_new_windows "google-chrome" 0 45 5 google-chrome-stable --restore-last-session
move_new_windows "Gnome-terminal" 2 30 3 gnome-terminal --working-directory=/home/haukot/programming/projects/slurm/slurm -- tmux
move_new_windows "emacs\\.Emacs" 2 30 3 ~/dotfiles/ec /home/haukot/programming/projects/slurm/slurm/Gemfile
move_new_windows "TelegramDesktop" 3 30 3 telegram-desktop
move_new_windows "Vivaldi-stable" 4 45 5 vivaldi-stable

for ws in 6 7 8; do
    move_new_windows "Gnome-terminal" "$ws" 30 2 gnome-terminal
done

wmctrl -s 0
