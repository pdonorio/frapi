'use strict';

myApp
.factory('Planner',['API', 'Logger', '$filter', function(API, Logger, $filter)
{

  var logger = Logger.getInstance('tasking_service');

  // This is the service
  var planner = {};
  var resource = 'tasks';
  var subresource = 'conversations';

  // title = task
  // description = description

  planner.get = function() {

    return API.get(resource)
    .then(function(response) {
        var data = [];
        if (response.count > 0) {
          logger.debug("Found tasks");
          data = response.items;

          // Get sub conversations on tasks
          return API.get(subresource).then(function(subres) {
            //console.log("res", subres);
            var subd = subres.items;
            // for each task
            data.forEach(function(obj, key){
              // the task is a substr
              var hash = obj.id.substr(0, 8);
// Order by timestamp desc?
              var found = $filter('filter')(subd, {task: hash}, true);
              data[key].comments = [];
              // for each comment of the single task
              found.forEach(function(val, lab){
                //console.log("Comm", val);
                data[key].comments.push(val.comment);
              });
            });

            //console.log(data);
            return data;
          });
        }
        return data;
    });

  }

  // factory function body that constructs planner
  return planner;

}]);