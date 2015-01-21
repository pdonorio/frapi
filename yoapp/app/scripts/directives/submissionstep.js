'use strict';

/**
 * @ngdoc directive
 * @name yoApp.directive:submissionStep
 * @description
 * # submissionStep
 */
myApp
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
        max: "=",
        data: "=",
        template: "=",
      },
      //controller: function($scope) {}

    };
  });
