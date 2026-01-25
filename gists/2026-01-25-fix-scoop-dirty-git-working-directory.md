**Fix Scoop dirty git working directory**

```bash
$ cd $env:USERPROFILE\scoop\buckets\main
$ git reset --hard HEAD
$ git clean -fd
```
