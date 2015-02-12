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
      templateUrl: 'submission/singlestep_view.html',

      /////////////////////////////////////
      //Directives isolated scope (cleaner and better)
      scope: {

        // I must rearrange all of this data...
        current: "=",
        step: "=",
        name: "=",
        max: "=",
        data: "=",
        template: "=",
        edit: "=",
      },
      controller: function($scope) {

        // On broadcast from submissioncontroller
        // this is launched when we open o switch step from the side menu
        $scope.$on('formActivation', function(event, active) {

          if (active && $scope.step == $scope.current) {
            //console.log("Open form " + $scope.step);
            $scope.myform.$show();
          }

          if (!active) {
            //$scope.myform.$hide();
          }

        });
      }

    };
  });
