
Для подгрузки obsidian, yarr в меню

```
update-desktop-database ~/.local/share/applications/
```


Чтобы пакеты не автообновлялись каждый день
`snap refresh --hold=forever`


Чтобы по переходу xgd-open (например org-protocol) на приложение переходило сразу, а не показывалась нотификация
https://github.com/zalckos/GrandTheftFocus


Ctrl+Tab / Ctrl+Shift+Tab для переключения вкладок в gnome-terminal
(в GUI настроек не биндится — GTK перехватывает как focus traversal,
но через gsettings работает):

```
gsettings set org.gnome.Terminal.Legacy.Keybindings:/org/gnome/terminal/legacy/keybindings/ next-tab '<Primary>Tab'
gsettings set org.gnome.Terminal.Legacy.Keybindings:/org/gnome/terminal/legacy/keybindings/ prev-tab '<Primary><Shift>Tab'
```
