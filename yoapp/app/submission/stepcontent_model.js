'use strict';
/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepContent', function (API)
{
  var resource = 'stepscontent';

  function loadData(step) {

    var parameters = {step: step, perpage: 100};

    return API.get(resource, parameters)
      .then(function(response) {
          var data = [];

          if (response.count > 0)
            // Response should be one row in this case
            var data = response.items.pop(); //tmp.sort();

          return data;
      });
  }

  // Constructor, with class name
  function StepContent(data) {
    this.StepContent = data;
  }
  // Public methods, assigned to prototype
  StepContent.prototype.getData = function () {
    return this.StepContent;
  };
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepContent.build = function (step) {
    // API call
    var data = loadData(step);
    // Create object
    return new StepContent(data);
  }

  // Give this service to someone
  return StepContent;
});
