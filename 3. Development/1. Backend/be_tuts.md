## Môi trường dev
- Mongodb: v4.2.9
- Java sdk: 1.8
- Consul: 1.7.1
- RabbitMQ: 3.8.1
- Gradle: 6.4.1

## Hướng dẫn build xem ở README.md
## Config:
- src/main/resource/config/application-dev.yml: cấu hình cho dev (database, rabbitmq, email, amz, app config)
- src/main/resource/config/application-prod.yml: cấu hình cho production (database, rabbitmq, email, amz, app config)
- src/main/resource/config/bootstrap-prod.yml: Cấu hình consul cho prod
