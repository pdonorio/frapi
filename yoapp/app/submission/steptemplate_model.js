'use strict';
/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepTemplate', function (API)
{
  var resource = 'stepstemplate';

  // Load, Save, Remove

  ////////////////////////////
  function loadData(step) {

    // WARNING: i need only one step!!!
    var parameters = {step: step, perpage: 999};

    return API.get(resource, parameters)
      .then(function(response) {
          var data = [];
          if (response.count > 0) {
            // Algorithm: create positions? No.
            var tmp = response.items;

            // Js foreach cycle: to create my array out of RDB json
            tmp.forEach(function(obj, index) {
                data[obj.position] = {label:obj.field, value:obj.type};
            });
          }
          console.log("Loaded from step ", step, "data", data);
          return data;
      });
  }

  ////////////////////////////
  // API try to save data
  function saveData(data) {

// TO FIX -
//This could be made automatic
    // Find the key to update, if any
    var params = { step: data['step'], position: data['position'] };
    return API.get(resource, params)
      .then(function(response) {
        // Set id
        data.id = null;
        if (response.count == 1)
            data.id = response.items[0].id;
        // How about i save it
        return API.set(resource, data).then(function(id) {
            console.log("Inserted id", id);
            return id;
        });
    });
  }

  ////////////////////////////
  // API to remove data
  function removeData(step, position) {
    var params = {step:step, position:position};

    // Selecting id to remove
    return API.get(resource, params)
      .then(function(response) {
        if (response.count == 1) {
            return API.del(resource, response.items[0].id);
        }
    });
  }

////////////////////////////////////
// FIXED
////////////////////////////////////

  // Constructor, with class name
  function StepTemplate(data) {
    this.StepTemplate = data;
  }
  // Public methods, assigned to prototype
  StepTemplate.prototype.getData = function () {
    return this.StepTemplate;
  };
  StepTemplate.prototype.setData = function (step, pos, label, value) {
    var data = {
        step: step,
        position: pos,
        field: label,
        type: value,
    };
    console.log("Set template data", data);
    return saveData(data);
  };
  StepTemplate.prototype.unsetData = function (step, position) {
    console.log("Template remove", step, position);
    return removeData(step, position);
  };
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepTemplate.build = function (step) {
    // API call
    var data = loadData(step);
    // Create object
    return new StepTemplate(data);
  }

  // Give this service to someone
  return StepTemplate;

////////////////////////////////////
});