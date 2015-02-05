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

# HOW TO: new resource (api python)
**to be fixed...**

0. Create new table (inside rethinkdb database, via chateau)
1. Define a new model inside data_models.py, with table of step 0
2. Implement Rdb resource inside resources.py with data model of step 1
3. Define route inside routes.py with resource created in the step 2
4. Test modifying clients/test_api.sh

Angular code to use it:
```
  // Angular query api
  DataResource.get("webcontent", perpage, currentpage)    // Use the data promise
    .then(function(data) {  //Success
        console.log(data);
        //do modifications to $scope
    }, function(object) {      //Error
      console.log("Controller api call Error");
      console.log(object);
    }
  );
```

