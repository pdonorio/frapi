'use strict';

myApp
.factory('Planner', function(API, Logger) {

  var logger = Logger.getInstance('tasking_service');

  // This is the service
  var planner = {};
  var resource = 'tasks';

  // title = task
  // description = description

  planner.get = function() {

    return API.get(resource)
    .then(function(response) {
        var data = [];
        // Response should be one row in this case
        if (response.count > 0) {
          logger.debug("Found tasks");
          data = response.items;
        }
        return data;
    });

  }

  // factory function body that constructs planner
  return planner;

});