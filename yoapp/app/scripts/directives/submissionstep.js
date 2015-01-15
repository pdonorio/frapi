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
      controller: function($scope)
      {
        //console.log($scope.data);
        console.log("Remove this controller " + ($scope.step + 1) + " ?");
//TO FIX -
        //?? NON FUNZIONA - chiedere a autore di xeditable
        //console.log($scope.myform);
      },
/*
      //manipulate DOM
      link : function(scope, element, attrs, ctrl) {
        console.log("Link");
      }
*/

    };
  });
