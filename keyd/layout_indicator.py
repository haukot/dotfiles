#!/usr/bin/env python3
import subprocess, threading
import gi
gi.require_version("Gtk", "3.0")
gi.require_version("AyatanaAppIndicator3", "0.1")
from gi.repository import AyatanaAppIndicator3 as AI, GLib, Gtk

OSD = ["osd_cat", "-d", "1", "-p", "middle", "-A", "center", "-s", "5",
       "-c", "white", "-O", "2", "-u", "black",
       "-f", "-*-*-bold-*-*-*-72-*-*-*-*-*-*-*"]

ind = AI.Indicator.new("keyd-layout", "input-keyboard-symbolic",
                      AI.IndicatorCategory.APPLICATION_STATUS)
ind.set_status(AI.IndicatorStatus.ACTIVE)
ind.set_label("EN", "RU")
ind.set_menu(Gtk.Menu())

def apply(layout, label):
    subprocess.Popen(["setxkbmap", "-layout", layout])
    p = subprocess.Popen(OSD, stdin=subprocess.PIPE)
    p.stdin.write(label.encode())
    p.stdin.close()
    ind.set_label(label, "RU")
    return False

def listen():
    p = subprocess.Popen(["keyd", "listen"], stdout=subprocess.PIPE, text=True)
    for line in p.stdout:
        line = line.strip()
        if line == "/ru":        GLib.idle_add(apply, "ru,us", "RU")
        elif line == "/workman": GLib.idle_add(apply, "us,ru", "EN")

threading.Thread(target=listen, daemon=True).start()
Gtk.main()
