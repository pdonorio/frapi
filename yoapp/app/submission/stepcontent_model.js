'use strict';
/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepContent', function (API, Logger)
{

  var logger = Logger.getInstance('content');

  /*********************************
  ** PRIVATE *
  ******************************** */
  var resource = 'stepscontent';
  var logresource = 'datalogs';

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

  // Log writing operation
  function logOperation(data) {
    var log = {
        user: data.user,
        record: data.recordid,
        operation: 'user_content',
        comment: data,
    };
    //console.log("Data to log", data);
    API.set(logresource, log)
      .then(function(response) {
        logger.debug("Op logged");
    });
  }

  // Save data from API
  function saveData(obj, data) {
    return API.set(resource, data)
      .then(function(response) {
        // Response here is the id of inserted/updated element
        obj.setId(response);

        // Log this operation inside db and make backup
        data.myid = response;
        return logOperation(data).then(function(){
            obj.saveBackup(data);
            //console.log(response);
            return true;
        });
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

    logger.log("Saving element", record);

// TO FIX-
// Log this db operation

    var data = {};
    // Save all in one array
    var values = [];
    var hashers = [];

    angular.forEach(obj, function(myjson, key) {
        //console.log(myjson);

        //empty value
        var value = '';
        if (myjson.value)
            value = myjson.value;
        //hash linked to step and field name
        var hash = null;
        if (myjson.hasher)
            hash = myjson.hasher;
        //push inside the new array
        values.push(value);
        hashers.push(hash);
    });
    data.values = values;
    data.hashes = hashers;
    // Add step field
    data.step = this.Step;
    // Update element if existing
    if (this.id !== null && !data.id)
        data.id = this.id;
    data.user = user;
    data.recordid = record;

    // Save it
    //console.log("Ready to save"); //console.log(data);
    return saveData(this, data);

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
