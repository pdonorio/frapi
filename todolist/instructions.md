How to do things
=====

Follow this bash command on a new docker-host

```
# Install docker on your host...

# Install fig
curl -L https://github.com/docker/fig/releases/download/1.0.1/fig-`uname -s`-`uname -m` > /usr/local/bin/fig; chmod +x /usr/local/bin/fig

# Clone repo
mkdir /git
cd /git/
git clone https://github.com/pdonorio/frapi.git

# Build and clean
./cluster.sh build_with_gui
./cluster.sh cleanall
./cluster.sh dcheck

# Open your development env
./cluster.sh run_with_gui
docker exec -it apic_webdev_1 bash

# Install libraries
sudo -i
export PATH=/opt/.nvm/v0.10.13/bin:$PATH
cd /opt/yo
npm install
cd /opt/
chown -R developer yo
exit
bower install

# Build the compressed production code
grunt build

```