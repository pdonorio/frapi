'use strict';
/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepContent', function (API, fieldPad)
{

  /*********************************
  ** PRIVATE *
  ******************************** */
  var resource = 'stepscontent';

  // Load data from API
  function loadData(step) {
    var parameters = {step: step, perpage: 100};

    return API.get(resource, parameters)
      .then(function(response) {
          var data = [];
          // Response should be one row in this case
          if (response.count > 0)
            var data = response.items.pop();
          return data;
      });
  }

  // Save data from API
  function saveData(data, obj) {
    return API.set(resource, data)
      .then(function(response) {
        //console.log("API saving");
        //console.log(data);
        obj.setId(response);
        return response;
        //console.log(response);
    });
  }

  /*********************************
  ** CLASS *
  ******************************** */
  // Constructor, with class name
  function StepContent(step, data) {
    this.id = null;
    this.Step = step;
    this.StepContent = data;
  }
  // Public methods, assigned to prototype
  StepContent.prototype.getData = function () {
    return this.StepContent;
  };
  StepContent.prototype.setId = function (id) {
    this.id = id;
    //console.log("Setting an existing id: " + this.id);
  }
  StepContent.prototype.setData = function (obj) {

    var data = {};
    // Save all in one array
    var values = [];
    angular.forEach(obj, function(value, key) {
        //empty value
        if (value == undefined || value == null)
            value = '';
        //push inside the new array
        values.push(value);
    });
    data.values = values;
    // Add step field
    data.step = this.Step;
    // Update element if existing
    if (this.id !== null && !data.id)
        data.id = this.id;
    // Save it
    saveData(data, this);

// TO FIX -
    // Return a promise to work on notification?
    // Where should notification stay?
    var promise = null;
    return promise;
  }

  /*********************************
  ** CONTEXT *
  ******************************** */
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepContent.build = function (step) {
    // API call
    var data = loadData(step);
    // Create object
    return new StepContent(step, data);
  }

  // Give this service to someone
  return StepContent;
});
