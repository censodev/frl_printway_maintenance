kill -9 $(ps -ef | grep '[p]gc-gateway*' | awk '{print $2}' | head -n 1)
