#!/usr/bin/env python3
import subprocess
# just a helper function
get = lambda cmd: subprocess.check_output(cmd).decode("utf-8")
# get the current mouse position
current = [int(n) for n in [it.split(":")[1] for it in get(["xdotool", "getmouselocation"]).split()[:2]]]
# get the x/y size of top screen
screendata = [(s.split("x")[0], s.split("x")[1].split("+")[0]) for s in get(["xrandr"]).split() if "+0+0" in s ][0]
xy = [int(n) for n in screendata]
# get the x/y size of all screens
# screendatas = [(s.split("x")[0], s.split("x")[1].split("+")[0]) for s in get(["xrandr"]).split() if "+" in s and "x" in s ]
# xys = [(int(x), int(y)) for (x,y) in screendatas]
# TODO: detect current screen and set mouse position propotionally it's size(if monitors
# have diferent sizes)

# see if the mouse is on the bottom- or top screen
if current[1] < xy[1]:
    # we on top
    move_y = xy[1] - current[1] + (1 - (xy[1] - current[1]) / xy[1]) * 900 # 900 from 1600*900, laptop screen size
    command = ["xdotool", "mousemove", "--sync", str(int(current[0])), str(current[1]+move_y)]
else:
    # we on bottom
    # xy[1] - size of top monitor, 900 from 1600*900, laptop screen size
    move_y = current[1] - xy[1] + (1 - (current[1] - xy[1]) / 900) * xy[1]
    command = ["xdotool", "mousemove", "--sync", str(int(current[0])), str(current[1]-move_y)]

subprocess.Popen(command)
# optional: click after the mouse move: comment out if not needed / wanted
# subprocess.Popen(["xdotool", "click", "1"])
