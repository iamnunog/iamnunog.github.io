1. Generate the certs (self-sign CA Cert, Server Certs and Client Certs)

```bash
$ # self sign CA
$ openssl genrsa -aes256 -out ca-key.pem 4096
...
$ openssl req -new -x509 -days 730 -key ca-key.pem -sha256 -out ca.pem
...
$ # dockerd cert
$ openssl genrsa -out server-key.pem 4096
...
$ openssl req -subj "/CN=$HOST" -sha256 -new -key server-key.pem -out server.csr
...
$ echo subjectAltName = DNS:$HOST,IP:<IP>,IP:127.0.0.1 >> extfile.cnf
$ echo extendedKeyUsage = serverAuth >> extfile.cnf
$ openssl x509 -req -days 730 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile extfile.cnf
...
$ # generate client cert (for docker client)
$ openssl genrsa -out key.pem 4096
...
$ openssl req -subj '/CN=client' -new -key key.pem -out client.csr
$ echo extendedKeyUsage = clientAuth > extfile-client.cnf
$ openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out cert.pem -extfile extfile-client.cnf
...
$ # set proper permissions to the certs
$ chmod -v 0400 ca-key.pem key.pem server-key.pem
$ chmod -v 0444 ca.pem server-cert.pem cert.pem
$ # copy the newly create docker certs and move them to the `/etc/docker/certs.d`
$ cp ca-key.pem key.pem server-key.pem /etc/docker/certs.d
```

1. Edit the dockerd deamon configuration `daemon.json`

```json
$ cat /etc/docker/daemon.json
{
    "hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"],
    "tlsverify": true,
    "tlscacert": "/etc/docker/certs.d/ca.pem",
    "tlscert": "/etc/docker/certs.d/server-cert.pem",
    "tlskey": "/etc/docker/certs.d/server-key.pem"
}
```

1. Setup the docker client certs in order to not need to specify the TLS settings

```bash
$ docker --tlsverify \
    --tlscacert=ca.pem \
    --tlscert=cert.pem \
    --tlskey=key.pem \
    -H=$HOST:2375 version
# instead
$ mkdir -pv ~/.docker
$ cp ca.pem cert.pem key.pem ~/.docker
$ export DOCKER_HOST=tcp://$HOST:2375 DOCKER_TLS_VERIFY=1
```

1. Restart the service

```bash
sudo service docker restart
```

1. Test if you can query **`dockerd`** information using the docker client

```bash
$ docker info
Client: Docker Engine - Community
 Version:    27.3.1
 Context:    default
 Debug Mode: false
 Plugins:
  buildx: Docker Buildx (Docker Inc.)
    Version:  v0.17.1
    Path:     /usr/libexec/docker/cli-plugins/docker-buildx
  compose: Docker Compose (Docker Inc.)
    Version:  v2.29.7
    Path:     /usr/libexec/docker/cli-plugins/docker-compose

Server:
 Containers: 3
...
```

Thats all.

References:

* [Use TLS (HTTPS) to protect the Docker daemon socket][r1]

[r1]:https://docs.docker.com/engine/security/protect-access/#use-tls-https-to-protect-the-docker-daemon-socket/
