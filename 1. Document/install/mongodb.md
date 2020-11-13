---
id: mongodb
title: Install mongodb
sidebar_label: Install mongodb
---

## Add repository
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 4B7C549A058F8B6B
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list
```

## Install mongodb
```
sudo apt-get update
sudo apt install mongodb-org=4.2.1 mongodb-org-server=4.2.1 mongodb-org-shell=4.2.1 mongodb-org-mongos=4.2.1 mongodb-org-tools=4.2.1 -y
```

## Start mongodb
```
sudo systemctl enable mongod
sudo systemctl start mongod
```

## Change config
Open `/etc/mongod.conf`, add to end of file:
```
replication:
  replSetName: replocal
```

Change line:
```
bindIp: 127.0.0.1 -> bindIp: 127.0.0.1,,<SV_IP>
```

Restart mongo:
```
service mongod restart
```

## Security
Read: https://www.digitalocean.com/community/tutorials/how-to-secure-mongodb-on-ubuntu-18-04
