rm -rf build.zip
yarn run build
zip -r build.zip build
scp build.zip root@188.166.184.148:~/pgc-seller
