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
      controller: ['$scope', '$filter', function($scope, $filter) {

//TO FIX - define a function to update at every STEP CLICK CHANGE

        $scope.init = function(tmp) {
            console.log(tmp);
        }

//TO FIX -
        //?? NON FUNZIONA - chiedere a autore di xeditable
        //console.log($scope.myform);

        //fix data based on template
        //foreach template, get data and create new element in scope
        var results = [];   //ARRAY and NOT JSON!!!!!
        //otherwise ng-repeat filters DO NOT WORK

        for (var j = 0; j < $scope.template.length; j++)
        {
            //get the position
            var tmp = $scope.template[j];
            var i = tmp.pos;

            //find existing data in that position
            var data = $filter('filter')($scope.data, {pos: i});
            tmp.value = null;
            //if exists
            if (data && data.length > 0 && data[0].key == tmp.key) {
                //mix template with existing data inside results
                tmp.value = data[0].value;
            }
            //save results with key pos orderable
            results[j] = angular.copy(tmp);
        };
        $scope.data = results;
      }],

/*
      //manipulate DOM
      link : function(scope, element, attrs, ctrl) {
        console.log("Link");
      }
*/

    };
  });
