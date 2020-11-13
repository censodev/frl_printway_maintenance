---
id: consul
title: Install Consul
sidebar_label: Install Consul
---

## Step 1 — Installing Consul

To install it, update the package index on your server with `apt`:

```
sudo apt update
```

Then install `unzip`:

```
sudo apt-get install unzip
```

Install consul with widget:

```
cd /usr/local/bin
sudo wget https://releases.hashicorp.com/consul/1.7.3/consul_1.7.3_linux_amd64.zip
sudo unzip consul_1.7.3_linux_amd64.zip
sudo rm -rf consul_1.7.3_linux_amd64.zip
```

## Step 2 — Configuring Consul

Config consul service:

```
nano /etc/systemd/system/consul.service
```

```
[Unit]
Description=Consul Startup process
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c '/usr/local/bin/consul agent -config-dir /etc/consul.d/'
TimeoutStartSec=0

[Install]
WantedBy=default.target
```

Generate consul keygen:

```
consul keygen
```

Create `config.json`:

```
nano /etc/consul.d/config.json
```

Replace `consul_keygen` with your keygen and `server_ip` with your server ip.

```
{
    "bootstrap_expect": 1,
    "client_addr": "server_ip",
    "bind_addr": "server_ip",
    "datacenter": "Us-Central",
    "data_dir": "/var/consul",
    "domain": "consul",
    "enable_script_checks": true,
    "dns_config": {
        "enable_truncate": true,
        "only_passing": true
    },
    "enable_syslog": true,
    "encrypt": "consul_keygen",
    "leave_on_terminate": true,
    "log_level": "INFO",
    "rejoin_after_leave": true,
    "server": true,
    "start_join": [
        "server_ip" //
    ],
    "ui": true,
    "acl": {
      "enabled": true,
      "default_policy": "deny",
      "down_policy": "extend-cache"
    }
}
```

Restart consul.

```
sudo systemctl daemon-reload
sudo systemctl start consul
```

To init acl run:
```
consul acl bootstrap -http-addr=<servier_ip>:8500
```

Test consul:

```
consul members -http-addr=127.0.0.1:8500
```

```
Output:

Node                        Address         Status  Type    Build  Protocol  DC          Segment
ubuntu-s-2vcpu-4gb-sgp1-01  10.15.0.6:8301  alive   server  0.9.3  2         us-central  <all>
```

Get Ip from `Address` and replace with `server_ip` in `config.json`.

Restart consul.
