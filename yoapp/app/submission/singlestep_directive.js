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
      templateUrl: 'submission/submission_singlestep_view.html',

      /////////////////////////////////////
      //Directives isolated scope (cleaner and better)
      scope: {
        step: "=",  // This is the reason of the isolated scope
        name: "=",
        current: "=",
        id: "=",
      },
      controller: 'StepDirectiveController',

    };
  });
