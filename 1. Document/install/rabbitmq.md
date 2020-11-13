---
id: rabbitmq
title: Install RabbitMq
sidebar_label: Install RabbitMq
---

## Add repository
```
wget -O- https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo apt-key add -
echo "deb https://packages.erlang-solutions.com/ubuntu bionic contrib" | sudo tee /etc/apt/sources.list.d/rabbitmq.list
```

## Install erlang
```
sudo apt-get update
sudo apt-get install erlang -y
```

## Install rabbitmq
```
wget -O - "https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc" | sudo apt-key add -
touch /etc/apt/sources.list.d/bintray.rabbitmq.list
echo "deb https://dl.bintray.com/rabbitmq-erlang/debian bionic erlang" >> /etc/apt/sources.list.d/bintray.rabbitmq.list
echo "deb https://dl.bintray.com/rabbitmq/debian bionic main" >> /etc/apt/sources.list.d/bintray.rabbitmq.list
sudo apt-get update
sudo apt-get install rabbitmq-server -y
```

## Allow port rabbitmq
```
sudo ufw allow 15672
```

## Enable rabbitmq plugins
```
rabbitmq-plugins enable rabbitmq_management
rabbitmq-plugins enable rabbitmq_management_agent
rabbitmq-plugins enable rabbitmq_mqtt
rabbitmq-plugins enable rabbitmq_amqp1_0
rabbitmq-plugins enable rabbitmq_web_dispatch
rabbitmq-plugins enable rabbitmq_web_mqtt
```
