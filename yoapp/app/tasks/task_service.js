'use strict';

myApp
.factory('Planner', function() {

  // This is the service
  var planner = {};

  var tasks = [
      {title: 'name', description: 'extra'},
      {title: 'a', description: 'b'},
  ];

  planner.get = function() {
    return tasks;

  }

  // factory function body that constructs planner
  return planner;

});