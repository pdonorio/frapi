'use strict';
/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepContent', function (API)
{

  /*********************************
  ** PRIVATE *
  ******************************** */
  var resource = 'stepscontent';

  // Load data from API
  function loadData(recordid, step) {

    var parameters = {
        recordid: recordid,
        step: step,
        perpage: 999,
    };

    return API.get(resource, parameters)
      .then(function(response) {
          var data = [];
          // Response should be one row in this case
          if (response.count > 0)
            data = response.items.pop();
          return data;
      });
  }

  // Save data from API
  function saveData(obj, data) {
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
  function StepContent(record, step) {
    this.id = null;
    this.Step = step;
    this.Record = record;
    this.Content = [];
  }
  // Public methods, assigned to prototype
  StepContent.prototype.setId = function (id) {
    this.id = id;
    //console.log("Setting an existing id: " + this.id);
  }
  StepContent.prototype.restoreBackup = function (data) {
    return this.Content;
  }
  StepContent.prototype.saveBackup = function (data) {
    this.Content = angular.copy(data);
  }
  StepContent.prototype.getData = function () {
    // API call
    this.Content = loadData(this.Record, this.Step);
    return this.Content;
  };
  StepContent.prototype.setData = function (obj, user, record) {

    console.log("Init save");
    console.log(obj);

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
    data.user = user;
    data.recordid = record;

    console.log("Ready to save");
    console.log(data);

    // Save it
    //return saveData(this, data);

  }
  StepContent.prototype.unsetData = function (key) {
    console.log("Content remove", key);
    //return removeData(key);
  };

  /*********************************
  ** CONTEXT *
  ******************************** */
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepContent.build = function (record, step)
  {
    // Create object
    return new StepContent(record, step);
  }

  // Give this service to someone
  return StepContent;
});
