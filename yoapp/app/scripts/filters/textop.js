'use strict';

/**
 * @ngdoc filter
 * @name yoApp.filter:ucFirst
 * @function
 * @description
 * # ucFirst
 * Filter in the yoApp.
 */
angular.module('textOperations', [])
  .filter('ucFirst', function () {
    return function (input) {
        //console.log("For ", input)
        if (input && input != null) {
            input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
        return input;
    };

  });

angular.module('arrayOperations', [])
  .filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
