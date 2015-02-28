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
  function saveData(data) {
    return API.set(resource, data)
      .then(function(response) {
        console.log("API saving");
        console.log(data);
        console.log(response);
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
  StepContent.prototype.setData = function (obj) {

    // Be sure you are with a copy, and not a reference to DOM data!!
    var data = angular.copy(obj);
    // Add fields name
    var counter = 1;

    angular.forEach(data, function(value, key) {
        //console.log(key,value);
        var str = String(counter++);
        var field = 'field' + fieldPad.substring(0, fieldPad.length - str.length) + str;
        delete data[key];
        data[field] = value;
    });
    // Add step field
    data.step = this.Step;

    console.log("To save");
    console.log(data);

    // Save it
    this.id = saveData(data);

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
