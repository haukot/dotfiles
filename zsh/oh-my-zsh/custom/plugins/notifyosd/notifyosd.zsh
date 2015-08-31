function active-window-id {
    echo `xprop -root | awk '/_NET_ACTIVE_WINDOW\(WINDOW\)/{print $NF}'`
}

# end and compare timer, notify-send if needed
function notifyosd-precmd() {
    if [ ! -z "$cmd" ]; then
        cmd_end=`date +%s`
        ((cmd_time=$cmd_end - $cmd_start))
    fi
    if [ ! -z "$cmd" -a $cmd_time -gt 10 -a "$window_id_before" != "$(active-window-id)" ]; then
            notify-send -i utilities-terminal -u low "$cmd_basename completed" "\"$cmd\" took $cmd_time seconds"
            unset cmd
    fi
}
 
# make sure this plays nicely with any existing precmd
precmd_functions+=( notifyosd-precmd )
 
# get command name and start the timer
function notifyosd-preexec() {
    window_id_before=$(active-window-id)
    cmd=$1
    cmd_basename=${cmd[(ws: :)1]}
    cmd_start=`date +%s`
}
 
# make sure this plays nicely with any existing preexec
preexec_functions+=( notifyosd-preexec )