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

  function loadData() {
    return API.get(resource)
      .then(function(response) {
          var data = [];
          if (response.count > 0) {
            var tmp = response.items; //tmp.sort();

            //console.log(tmp);
            data[0] = null;

            // Js foreach cycle: to create my array out of RDB json
            tmp.forEach(function(obj, index) {
                var j = obj.step;
                if (!data[j])
                    data[j] = [];
                if (data[j][obj.element])
                  console.log("Warning: found duplicate in "+j+":"+obj.element)
                else
                  data[j][obj.position] = {key: obj.field, value: obj.type};
            });

            // Filling holes?
            for (var i = 1; i < data.length; i++) {
                if (data[i]) {
                    for (var j = 0; j < data[i].length; j++) {
                        if (!data[i][j])
                            data[i][j] = [];
                    };
                } else {
                    data[i] = [];
                }
            };
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
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepTemplate.build = function (data) {
    // API call
    var data = loadData();
    // Create object
    return new StepTemplate(data);
  }

  // Give this service to someone
  return StepTemplate;

////////////////////////////////////
});