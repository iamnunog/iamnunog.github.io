Following [Yubico Key Setup][r1], if you looking to setup Yubico Key to allow to do SUDO password-less Auth's, follow the steps bellow

1. Install Yubico PAM tools, this will enable you to use the Key for auth's

```bash
$ sudo dnf install pam-u2f
$ # create a dir in your home in order to use it Yubico configuration store
$ mkdir -p ~/.config/Yubico
$ # register the Yubico Key
$ pamu2fcfg > ~/.config/Yubico/u2f_keys
```

1. Configure you PAM for SUDO

```bash
$ # Edit /etc/pam.d/sudo and add the following to the first line
$ # auth       sufficient   pam_u2f.so 
$ sudo vim /etc/pam.d/sudo
...
$ head -n1 /etc/pam.d/sudo
auth       sufficient   pam_u2f.so 
```

1. To the same step for the Polkit to allow GUI to follow the same process of ath

```bash
$ # Edit /etc/pam.d/polkit-1 and add the following to the first line
$ # auth       sufficient   pam_u2f.so 
$ sudo vim /etc/pam.d/polkit-1
...
$ head -n1 /etc/pam.d/polkit-1
auth       sufficient   pam_u2f.so 
```

1. Restart your system

```bash
sudo reboot
```

All done, enjoy!

[r1]: https://nasgoncalves.github.io/yubico-key-setup