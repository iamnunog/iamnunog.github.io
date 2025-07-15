### With Deamon

```bash
valgrind --leak-check=full --log-file="logfile.out" --trace-children=yes --track-origins=yes -v ./splunk start
```

### Without Deamon

```bash
valgrind --leak-check=full --log-file="logfile.out" -v ./splunk start
```

### Results

```bash
==26829==  Uninitialised value was created by a stack allocation
==26829==    at 0x125FED0: AesCcm192NonceGenerator::AesCcm192NonceGenerator() (in /data/splunk/bin/splunkd)

==26829==  Uninitialised value was created by a stack allocation
==26829==    at 0xA31AD6: FileInputTracker::fileHalfMd5(unsigned long*, FileDescriptor, Str const&, long, long) (in /data/splunk/bin/splunkd)

==26829==  Uninitialised value was created by a stack allocation
==26829==    at 0x126054D: AesCcm192Key::encrypt(StrSegment const&, AesCcm192Nonce const&, Str const&) const (in /data/splunk/bin/splunkd)
```