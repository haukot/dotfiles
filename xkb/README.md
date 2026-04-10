Run as

``` 
setxkbmap -layout custom_workman -variant base -verbose -option "ctrl:swap_lalt_lctl_lwin" -types "complete+workman_ru_ctrl(ctrlfix)"
```


With copying
```
sudo cp xkb/types/workman_ru_ctrl /usr/share/X11/xkb/types/workman_ru_ctrl && sudo cp xkb/symbols/custom_workman /usr/share/X11/xkb/symbols/custom_workman && setxkbmap -layout custom_workman -variant base -verbose -option "ctrl:swap_lalt_lctl_lwin" -types "complete+workman_ru_ctrl(ctrlfix)"
```
