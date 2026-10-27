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

paperwm_winprops() {
    gsettings --schemadir "$HOME/.local/share/gnome-shell/extensions/paperwm@paperwm.github.com/schemas" \
        "$1" org.gnome.shell.extensions.paperwm winprops "${@:2}"
}

# Keep existing rules; oneshot rules are consumed only in PaperWM's memory.
# Restore GSettings afterwards so a PaperWM reload cannot rearm these rules.
original_winprops=$(paperwm_winprops get) || exit 1
existing_winprops=${original_winprops#*\[}
existing_winprops=${existing_winprops%]}
trap 'paperwm_winprops set "$original_winprops"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
paperwm_winprops set "[
    '{\"wm_class\":\"StartupSlurm\",\"spaceIndex\":2,\"oneshot\":true}',
    '{\"wm_class\":\"Emacs\",\"spaceIndex\":2,\"oneshot\":true}',
    '{\"wm_class\":\"TelegramDesktop\",\"spaceIndex\":3,\"oneshot\":true}',
    '{\"wm_class\":\"Vivaldi-stable\",\"spaceIndex\":4,\"oneshot\":true}',
    '{\"wm_class\":\"/^google-chrome$/i\",\"spaceIndex\":0,\"oneshot\":true}',
    '{\"wm_class\":\"StartupTerminal6\",\"spaceIndex\":5,\"oneshot\":true}',
    '{\"wm_class\":\"StartupTerminal7\",\"spaceIndex\":6,\"oneshot\":true}',
    '{\"wm_class\":\"StartupTerminal8\",\"spaceIndex\":7,\"oneshot\":true}'
    ${existing_winprops:+, $existing_winprops}]" || exit 1

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

# Remember only windows created by this script, including their target indices.
declare -A startup_workspaces=()

settle_startup_windows() {
    local snapshot wid actual target attempt stable=0

    # A successful wmctrl request does not mean PaperWM has finished placing
    # the window. Require two seconds of stable placement, with a bounded retry.
    for ((attempt = 0; attempt < 100; attempt++)); do
        sleep 0.2
        snapshot=$(wmctrl -l) || return 1
        local all_placed=true
        for wid in "${!startup_workspaces[@]}"; do
            target=${startup_workspaces[$wid]}
            actual=$(awk -v id="$wid" '$1 == id { print $2; exit }' <<< "$snapshot")
            if [ "$actual" != "$target" ]; then
                all_placed=false
                if [ -n "$actual" ]; then
                    printf 'session-startup: moving %s from workspace %s to %s\n' \
                        "$wid" "$((actual + 1))" "$((target + 1))" >&2
                    wmctrl -ir "$wid" -t "$target" || return 1
                fi
            fi
        done
        if "$all_placed"; then
            stable=$((stable + 1))
            [ "$stable" -ge 10 ] && return 0
        else
            stable=0
        fi
    done

    printf 'session-startup: windows did not settle on their target workspaces\n' >&2
    return 1
}

launch_on_workspace() {
    local workspace="$1"
    local class="$2"
    shift
    shift
    local before=()
    local wmctrl_workspace=$((workspace - 1))
    local wid deadline=$((SECONDS + 60))

    mapfile -t before < <(list_windows "$class")

    wmctrl -s "$wmctrl_workspace"
    sleep 1
    "$@" &

    while [ "$SECONDS" -lt "$deadline" ]; do
        while read -r wid; do
            [ -z "$wid" ] && continue
            if ! contains_window "$wid" "${before[@]}"; then
                startup_workspaces[$wid]=$wmctrl_workspace
                settle_startup_windows
                return $?
            fi
        done < <(list_windows "$class")

        sleep 0.2
    done

    printf 'session-startup: timed out waiting for %s\n' "$class" >&2
    return 1
}

launch_chrome() {
    google-chrome-stable \
        --user-data-dir="$CHROME_USER_DATA_DIR" \
        --profile-directory="$CHROME_PROFILE" \
        --restore-last-session
}

launch_on_workspace 3 "StartupSlurm" gnome-terminal --class=StartupSlurm --working-directory=/home/haukot/programming/projects/slurm/slurm -- tmux || exit 1
launch_on_workspace 3 "emacs\\.Emacs" ~/dotfiles/ec /home/haukot/programming/projects/slurm/slurm/Gemfile || exit 1
sleep 1
launch_on_workspace 4 "TelegramDesktop" telegram-desktop || exit 1
launch_on_workspace 5 "Vivaldi-stable" vivaldi-stable || exit 1

for ws in 6 7 8; do
    launch_on_workspace "$ws" "StartupTerminal$ws" gnome-terminal --class="StartupTerminal$ws" || exit 1
done

launch_on_workspace 1 "google-chrome" launch_chrome || exit 1
wmctrl -s 0
settle_startup_windows || exit 1
