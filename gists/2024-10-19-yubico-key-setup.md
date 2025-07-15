1. Verify if the system detects correctly the Yubico key

```bash
sudo dmesg
```

You should be able to see something similar to this

```log
[  988.570148] hid-generic 0003:1050:0402.0002: hiddev96,hidraw0: USB HID v1.10 Device [Yubico YubiKey FIDO] on usb-0000:04:00.3-1/input0
```

1. Install required packages

```bash
$ sudo dnf install yubikey-manager pcsc-lite
$ sudo systemctl start pcscd
$ sudo systemctl enable pcscd
```

1. Check the device month group (I am using exa), make sure your user is part of this group.

```bash
$ ls /dev/hidraw0
crw-rw----@ 242,0 root 19 Oct 14:34 /dev/hidraw0
$ # check the the group name 
$ getent group 19
floppy:x:19:
$ # add your user to this group
$ sudo usermod -aG floppy $(whoami)
```

1. Download the proper udev rules to make sure the device is mounted with the group you already are part of, restart udev

```bash
$ sudo wget https://raw.githubusercontent.com/Yubico/libu2f-host/master/70-u2f.rules -O /etc/udev/rules.d/70-u2f.rules
$ cat /etc/udev/rules.d/70-u2f.rules
$ # check the group from the configuration, parameter GROUP
$ vim /etc/udev/rules.d/70-u2f.rules
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", ATTRS{idVendor}=="1050", ATTRS{idProduct}=="0113|0114|0115|0116|0120|0121|0200|0402|0403|0406|0407|0410", TAG+="uaccess", GROUP="floppy", MODE="0660"
...
$ # save the changes
$ sudo udevadm control --reload-rules
$ sudo udevadm trigger
```

1. Test the access to the deivce 

```bash
$ ykman info

Device type: Security Key NFC
Firmware version: 5.7.1
Form factor: Keychain (USB-A)
Enabled USB interfaces: FIDO
NFC transport is enabled

Applications    USB             NFC
Yubico OTP      Not available   Not available
FIDO U2F        Enabled         Enabled
FIDO2           Enabled         Enabled
OATH            Not available   Not available
PIV             Not available   Not available
OpenPGP         Not available   Not available
YubiHSM Auth    Not available   Not available
```

If you see this you are good to go.
