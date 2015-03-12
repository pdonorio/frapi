'use strict';

/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepList', function (API) {

  var resource = 'steps';

// No, you can transform the result just fine by using a .then() handler inside the service. That's how promises are supposed to be used.

  //////////////////////////////////////////
  // API resolve data
  function loadData() {
    return API.get(resource)
      .then(function(response) {
          var data = [];
          if (response.count > 0) {
            var tmp = response.items; //tmp.sort();

            // Js foreach cycle: to create my array out of RDB json
            tmp.forEach(function(element, index) {
              data[element.step] = element.label;
            });
          }


          return data;
      });
  }

  // API try to save data
  function saveData(step, value)
  {

    // Find the key to update
    var params = { step: key };
    return API.get(resource, params)
      .then(function(response) {
        if (!response.items) {
            console.log("Failed to get id: no saved data!!",key,value);
            return false;
        }
        // Here i know which recordo to update
        var id = null;
        // Case of update
        if (response.count == 1)
            id = response.items[0].id;

        var data = {
            id: id,
            step: key,
            label: value,
            description: 'from front-end interface',
        };
        // How about i save it
        return API.set(resource, data).then(function(id) {
            return id;
        }, function() {
            console.log("Failed to put data: no save!!",key,value);
            return false;
        });
    });
  }

  // API to remove data
  function removeData(key) {
    console.log("I want to remove", key);
    return false;
  }

  //////////////////////////////////////////
  // Constructor, with class name
  function StepList(data) {
    this.stepList = data;
  }
  // Public methods, assigned to prototype
  StepList.prototype.getData = function () {
    return this.stepList;
  };
  StepList.prototype.setData = function (data, key) {
    if (!data || !data[key])
        return false;
    //console.log("add/update data", key, data[key]);
    return saveData(key, data[key]);
  };
  StepList.prototype.unsetData = function (key) {
    console.log("Step remove", key);
    return removeData(key);
  };

  //////////////////////////////////////////
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepList.build = function (data) {
    // API call
    var data = loadData();
    // Create object
    return new StepList(data);
  }

  // Give this service to someone
  return StepList;
})
