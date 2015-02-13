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
                  data[j][obj.element] = {key: obj.label, value: obj.content};
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
  StepContent.build = function (data) {
    // API call
    var data = loadData();
    // Create object
    return new StepContent(data);
  }

  // Give this service to someone
  return StepContent;
});
