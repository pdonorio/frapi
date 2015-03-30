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
  var hashres = 'stepfields';
  var lastCommit = {
    existing: true,
    failed: false,
  }

  function cutCommit(hash) {
    // CUT TO FIRST 8 chars
    return hash.substr(0,8);
  }

  function getHash(step, name) {
    var params = { step: step, name: name};

    return API.get(hashres, params)
      .then(function(response) {

        if (response.count == 1) {
            var commit = cutCommit(response.items[0].id);
            lastCommit.existing = true;
            //console.log("Existing hash", commit);
            return commit;
        }
        return API.set(hashres, params).then(function(hash)
        {
            var commit = cutCommit(hash);
            lastCommit.existing = false;
            //console.log("Created hash", commit);
            return commit;
        });
    });
  }

  // Does this label already exists?
  // this is used to avoid duplicates at run time
  function checkName(name, step, pos) {

    var params = { step: step, field: name};
    return API.get(resource, params)
      .then(function(response) {
        //console.log("Params 1", params); console.log("Res 1", response);

        // Check if existing element is the one i am editing
        params.position = pos;
        return API.get(resource, params)
          .then(function(same) {
            //console.log("Res 2", same); console.log("Params 2", params);

            // Case 1: my new name is the same of old original
            if (same.count == 1)
                return false;
            // Case 2: this name already exists in another field of the same step
            if (response.count == 1)
                return true;
            // Case 3: none of the above
            return false;
        });
    });
  }

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
                    hash: obj.hash,
                    //hashStatus: 'new',    //not necessary for now
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

    // need the hash
    return getHash(params.step, data['field']).then(function(hash) {

        return API.get(resource, params)
          .then(function(response) {
            // Set id
            data.id = null;
            if (response.count == 1)
                data.id = response.items[0].id;
            data.hash = hash;
            // How about i save it
            return API.set(resource, data).then(function(id) {
                console.log("Insert / update id", id);
                data.id = id;
                return data;
            });
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

    this.opts = [
        {value: 0, text: 'opzionale'},
        {value: 1, text: 'obligatorio'}
    ];

// TO FIX - define more and better
    // Should be defined inside database?
    // Or inside configuration (app.conf)?
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
        {value: 8, text: 'list', desc:
            'Define a list of possible values (e.g. a dictionary)'},
    ];

  }
  // Public methods, assigned to prototype
  StepTemplate.prototype.checkLabel = function (name, step, pos) {
    return checkName(name, step, pos);
  };
  StepTemplate.prototype.checkHash = function () {
    return lastCommit.existing;
  };
  StepTemplate.prototype.getOpts = function () {
    return this.opts;
  };
  StepTemplate.prototype.getTypes = function () {
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
  StepTemplate.build = function (step, skipLoading) {
    var data = null;
    // API call
    if (!skipLoading)
        data = loadData(step);
    // Create object
    return new StepTemplate(data);
  }

  // Give this service to someone
  return StepTemplate;

////////////////////////////////////
});