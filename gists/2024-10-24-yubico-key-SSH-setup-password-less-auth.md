Following [Yubico Key Setup][r1], if you looking to setup Yubico Key to allow to do SSH password-less Auth's, follow the steps bellow

1. Generate a **ecdsa-sk** cert

```bash
$ ssh-keygen -t ed25519-sk -C "<github_email>"
$ cat ~/.ssh/id_ed25519_sk.pub
$ # copy the pubkey to the to the clipboard
```

1. Add the public key to the GitHub
1. Configure your **`~/ssh/config`** in the following way (similar)

```bash
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_sk
  IdentitiesOnly yes
```

1. Restart *ssh-agent* and add the new key to the SSH agent 

```bash
$ eval $(ssh-agent -s)
$ ssh-add ~/.ssh/id_ed25519_sk
```

1. Test the SSH Connection

```bash
$ ssh -T git@github.com
$ # you should expect to see something like this
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

Enjoy!

[r1]: https://nasgoncalves.github.io/yubico-key-setup