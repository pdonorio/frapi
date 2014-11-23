#!/bin/bash
p="/opt/fsshare"

keygen=/usr/bin/ssh-keygen
keyfile=/root/.ssh/id_rsa
keyauth=/root/.ssh/authorized_keys

if [ ! -f $keyfile ]; then
  $keygen -t rsa -b 2048 -f $keyfile -q -N ''
fi

# Set authorized to current node
cat $keyfile.pub > $keyauth
# Save key for future use inside a shared volume
mkdir -p $p/k
cat $keyfile > $p/k/abc
chmod 600 $p/k/abc

# echo "== Use this private key to log in =="
# cat $keyfile
