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
  function loadData(step, obj) {
    var parameters = {step: step, perpage: 100};

    return API.get(resource, parameters)
      .then(function(response) {
          var data = [];
          // Response should be one row in this case
          if (response.count > 0)
            var data = response.items.pop();
          obj.init(step, data);
      });
  }

  // Save data from API
  function saveData(data, obj) {
    return API.set(resource, data)
      .then(function(response) {
        // Response here is the id of inserted/updated element
        obj.setId(response);
        obj.saveBackup(data);
        return true;
        //console.log(response);
    }, function() {
        return false;
    });
  }

  /*********************************
  ** CLASS *
  ******************************** */
  // Constructor, with class name
  function StepContent() {
    this.id = null;
    this.Step = 0;
    this.StepContent = [];
  }
  // Public methods, assigned to prototype
  StepContent.prototype.init = function (step, data) {
    this.Step = step;
    this.StepContent = data;
  };
  StepContent.prototype.getData = function () {
    return this.StepContent;
  };
  StepContent.prototype.setId = function (id) {
    this.id = id;
    //console.log("Setting an existing id: " + this.id);
  }
  StepContent.prototype.restoreBackup = function (data) {
    return this.StepContent;
  }
  StepContent.prototype.saveBackup = function (data) {
    this.StepContent = angular.copy(data);
  }
  StepContent.prototype.setData = function (obj) {

    var data = {};
    // Save all in one array
    var values = [];
    angular.forEach(obj, function(myjson, key) {
        //empty value
        var value = '';
        if (myjson.value)
            value = myjson.value;
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
    return saveData(data, this);

  }

  /*********************************
  ** CONTEXT *
  ******************************** */
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepContent.build = function (step) {
    // Create object
    var obj = new StepContent();
    // API call
    loadData(step, obj);
    // Send object
    return obj;
  }

  // Give this service to someone
  return StepContent;
});
