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
  StepTemplate.prototype.unsetData = function (key) {
    console.log("Template remove", key);
    //return removeData(key);
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