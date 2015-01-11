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
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0,1).toUpperCase()+input.substring(1);
    };
  });
