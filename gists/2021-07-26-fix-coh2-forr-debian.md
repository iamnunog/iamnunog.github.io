```bash
#!/bin/sh
# install cabextract first
# debian wise
# sudo apt-get install -y cabextract
cd ~/.steam/steam/steamapps/compatdata/231430/pfx/drive_c/windows/system32
wget https://download.microsoft.com/download/9/3/F/93FCF1E7-E6A4-478B-96E7-D4B285925B00/vc_redist.x64.exe
cabextract vc_redist.x64.exe
cabextract a10 
echo "enjoy!"
```
