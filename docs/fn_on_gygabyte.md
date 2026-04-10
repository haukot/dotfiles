# To hide symbol which shown when pressing 'Fn' alone



  sudo nano /etc/udev/hwdb.d/90-gigabyte-fn.hwdb                                
                                                                                
  Use this content (the second line must start with a single space):            
                                                                                
  evdev:input:b0003v0414p7A45*                                                  
   KEYBOARD_KEY_70072=unknown                                                   
                                                                                
  Then apply:                                                                   
                                                                                
  sudo systemd-hwdb update && sudo udevadm trigger                              
                                                                                
  That should kill the OSD icon when pressing Fn.
                                                                                
❯ what this will do?                                                            
                     
● It tells Linux to ignore the KEY_F23 keypress that your Fn key sends via the  
  GIGABYTE USB-HID device.   
