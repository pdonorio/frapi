'use strict';

/**
 * @ngdoc directive
 * @name yoApp.directive:submissionStep
 * @description
 * # submissionStep
 */
angular.module('yoApp')
  .directive('submissionStep', function () {
    return {
      //create my editable step panel for Submission
      restrict: 'E',
      //HTML template to work data inside the markup
      templateUrl: 'templates/step.html',

      /////////////////////////////////////
      //Directives isolated scope (cleaner and better)
      scope: {
        current: "=",
        step: "=",
        data: "=",
        max: "=",
      },

      /////////////////////////////////////
      //manage the local scope
      controller: function($scope) {
        console.log("Directive submission for " + $scope.step);
        //console.log($scope.data);
        //$scope.enable = $scope.step > 0 && $scope.step <= max;

      }
    };
  });
