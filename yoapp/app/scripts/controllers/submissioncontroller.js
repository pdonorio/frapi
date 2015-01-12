'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:SubmissionController
 * @description
 * # SubmissionController
 * Controller of the yoApp
 */
myApp
  .controller('SubmissionController', function ($scope) {

    $scope.current = 1;
    $scope.steps = [
        {step: 1, name: "estratto",
            form: {
                val: "data",
                test: "pippo",
                prova: "ancora",
            }
        },
        {step: 2, name: "fonte"},
        {step: 3, name: "festa"},
    ];

    //define step on click
    $scope.setStep = function(step) {
        $scope.current = step;
    }

  });
