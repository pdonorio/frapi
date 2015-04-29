'use strict';

/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepList', function (API, Logger) {

  var resource = 'steps';
  var logresource = 'datalogs';
  var logger = Logger.getInstance('steps');

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
  function saveData(step, value, user)
  {

    // Find the key to update
    var params = { step: step };
    return API.get(resource, params)
      .then(function(response) {
        if (!response.items) {
            console.log("Failed to get id: no saved data!!",step,value);
            return false;
        }
        // Here i know which record to update
        var id = null;
        var operation = 'admin_step_add';
        // Case of update
        if (response.count == 1) {
            id = response.items[0].id;
            operation = 'admin_step_update';
        }

        var data = {
            id: id,
            step: step,
            label: value,
            description: 'from front-end interface',
        };
        // How about i save it
        return API.set(resource, data).then(function(id) {
            // Log this operation
            data.user = user;
            data.id = id;
            return logOperation(data, operation).then(function() {
                return id;
            });
        }, function() {
            console.log("Failed to put data: no save!!",step,value);
            return false;
        });
    });
  }

  // API to remove data
  function removeData(step, user) {
    var params = {step:step};
    // Selecting id to remove
    return API.get(resource, params)
      .then(function(response) {
        if (response.count == 1) {
            params.user = user;
            params.id = response.items[0].id;
            // Log operation and delete
            return logOperation(params, 'admin_step_remove').then(function() {
                return API.del(resource, response.items[0].id);
            });
        }
        return false;
    });
  }

  ///////////////////////////
  // Log writing operation
  function logOperation(data, operation) {
    console.log("Data to log", data, operation);
    var log = {
        user: data.user,
        record: data.id,
        operation: operation,
        comment: data,
    };
    return API.set(logresource, log) .then(function(response) {
        logger.debug("AdminOp logged");
        return true;
    });
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
  StepList.prototype.setData = function (data, key, user) {
    if (!data || !data[key])
        return false;
    //console.log("add/update data", key, data[key]);
    return saveData(key, data[key], user);
  };
  StepList.prototype.unsetData = function (key, user) {
    //console.log("Step remove", key);
    return removeData(key, user);
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
