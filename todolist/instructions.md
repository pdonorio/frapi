How to do things
=====

Follow this bash command on a new docker-host

```
# Install docker on your host

# Install docker-compose

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
docker exec -it frapi_webdev_1 bash

# Install libraries
bower install

# Build the compressed production code
# TO FIX
gulp build?

```

# HOW TO: new resource (api python)

0. Create new table
(inside rethinkdb database, e.g. via chateau)
1. Define a new model inside data_models.py, with table of step 0
2. Test modifying the script clients/test_api.sh

Angular code to use it:
```
  // Angular query api: promise
  DataResource.get("webcontent"
    //, perpage, currentpage  //optional
    )
    .then(function(data) {  //Success
        //do modifications to $scope
        for (var i = 0; i < data.items.length; i++) {
          var x = data.items[i];
          console.log(x);
        };
        //console.log(data);
    }, function(object) {      //Error
      console.log("Controller api call Error");
      console.log(object);
    }
  );
```

