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
                data[obj.position] = {
                    label:obj.field,
                    value:obj.type,
                    extra:obj.extra,
                    required:obj.required,
                    //add required and extra?
                };
            });
          }
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

// TO FIX - define more and better
    this.types = [
        {value: 0, text: 'string', desc:
            'All text is allowed'},
        {value: 1, text: 'number', desc:
            'Only integers values'},
        {value: 2, text: 'email', desc:
            'Only e-mail address (e.g. name@mailserver.org)'},
        {value: 3, text: 'url', desc:
            'Only web URL (e.g. http://website.com)'},
        {value: 4, text: 'date', desc:
            'Choose a day from a calendar'},
        {value: 5, text: 'time', desc:
            'Choose hour and minutes'},
        {value: 6, text: 'pattern', desc:
            'Define a regular expression for a custom type'},
        {value: 7, text: 'color', desc:
            'Only colors in hexadecimal value. Choose from color picker.'},
        {value: 9, text: 'list', desc:
            'Define a list of possible values (e.g. a dictionary)'},
    ];

  }
  // Public methods, assigned to prototype
  StepTemplate.prototype.getTypes = function () {
// TO FIX -
    // Should be defined inside database?
    // Or inside configuration (app.conf)?
    return this.types;
  };
  StepTemplate.prototype.getData = function () {
    return this.StepTemplate;
  };
  StepTemplate.prototype.setData =
    function(step, pos, label, value, required, extra) {
    var data = {
        step: step,
        position: pos,
        field: label,
        type: value,
        required: required,
        extra: extra,
    };
    return saveData(data);
  };
  StepTemplate.prototype.unsetData = function (step, position) {
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