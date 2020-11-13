./gradlew -Pprod -Pwar clean bootWar
scp build/libs/pgc-gateway-0.0.1-SNAPSHOT.war root@188.166.184.148:~/pgc-gateway
