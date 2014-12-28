'use strict';

/**
 * @ngdoc directive
 * @name yoApp.directive:editableContent
 * @description
 * # editableContent
 */

myApp
  .directive('editableContent', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/editable.html', // markup for template
      //SUPER WARNING: directives create ISOLATED scope!!!
      scope: {
        // allows data to be passed into directive from controller scope
        item: '=',      //different for each call
        editable: '=',  //should be the same, to have one switch
      }
    };
  });
