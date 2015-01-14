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
      //manage the local scope
      controller: function($scope) {
        //?? NON FUNZIONA
        //console.log($scope.myform);

        //fix data based on template
        //foreach template, get data and create new element in scope

        //console.log($scope.template);
        //console.log($scope.data);
      },

    };
  });
