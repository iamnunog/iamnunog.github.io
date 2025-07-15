# Problem

The system would issue PAGE_DOWN keypresses in all the applications you would use even in the GRUB. This is clearly a problem  in the keyboard, but given this laptop as more then 12 years, I opted out from replacing it and just tried to fix it by working around the problem and blocking the issuance of the PAGE_DOWN key. This behavior is pretty erratic, sometimes the events would just be triggered in the beginning of the session and/or sometimes just get triggered in the middle of the session. I suspect this can be some kind of electrical problem.

# Confirming the diagnosis

I used to distinct applications to diagnose the issue, **`xev`** and **`evtest`**. Both would detect the issue, **`evtest`** would point out keycode 109 (PAGE_DOWN) and **`xev`** would give the keycode 117.

# Fixing the issue

## Xorg

```bash
echo "keycode 117=" > ~/.Xmodmap 
echo "xmodmap ~/.Xmodmap" ~/.xinitrc
```

## UDEV

* Create a new udev rule 
```bash
sudo vim /etc/udev/rules.d/99-keyboard.rules
```

* Add the following to the rule file
```bash
ACTION=="add|change", KERNEL=="event0", SUBSYSTEM=="input", RUN+="/usr/local/bin/block-key.sh"
```

* Create the key block script 
```bash
sudo vim /usr/local/bin/block-key.sh
```

* Add the following commands to it
```bash
#!/bin/bash
/usr/bin/setkeycodes 109 0x0000
/usr/bin/setkeycodes 117 0x0000
```

* Make sure it's executable
```bash
sudo chmod +x /usr/local/bin/block-key.sh
```

* Reload the rules

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

## GRUB

* Edit `/etc/default/grub`

```bash
# locate the GRUB_CMDLINE_LINUX_DEFAULT line and add `atkbd.disabled_keys=109`
GRUB_CMDLINE_LINUX_DEFAULT="quiet atkbd.disabled_keys=109"
```

Reboot now `sudo reboot`.


## Change the Apps CMD

If you using google chrome and other apps that you may still experiencing the issue just make sure you prepend the command with your shell command (e.g. **`/usr/bin/zsh`**) that it will be now ok given you fixed the Xorg config.

Thats it, Enjoy.