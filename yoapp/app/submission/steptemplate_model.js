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
          var data = {};
          if (response.count > 0) {
            var tmp = response.items;
            // Js foreach cycle: to create my array out of RDB json
            tmp.forEach(function(obj, index) {
                if (obj.step != step) {
                    console.log("Received wrong template!??");
                } else {
                    if (!obj.field || obj.field == '')
                        console.log("Failed field for template on step" + step)
                    else if (!obj.type || obj.type == '')
                        console.log("Failed type for template on step" + step)
                    else
                        data[obj.field]= obj.type;
                }
                //console.log("Warning: found duplicate in "+j+":"+obj.element)
            });
          }
          return data;
      });
  }

  ////////////////////////////
  // API try to save data
  function saveData(data) {

    // Check elements necessary...
    if (!data['step'] && !data['position']) {
        return false;
    }
    // Find the key to update
    var params = { step: data['step'], position: data['position'] };
    return API.get(resource, params)
      .then(function(response) {
        console.log("RESPONSE", response);
        return response;

        // // How about i save it
        // return API.set(resource, data).then(function(id) {
        //     return id;
        // });
    });
  }

  ////////////////////////////
  // API to remove data
  function removeData(params) {

    return API.get(resource, params)
      .then(function(response) {
        if (!response.items) {
            console.log("Template. Failed to get id: no save data!!",key,value);
            return false;
        }
        // Here i know which recordo to update
        var id = null;
        // Case of update
        if (response.count == 1)
            id = response.items[0].id;

        console.log("ID",id);
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
  StepTemplate.prototype.unsetData = function (step, label) {
    console.log("Template remove", step, label);
    var params = {};
    if (step) {
        params.step = step;
    } else if (label) {
        params.field = label;
    }
    return removeData(params);
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