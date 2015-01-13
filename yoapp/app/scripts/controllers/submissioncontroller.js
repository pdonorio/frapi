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
            form: [
                {pos:1, key: "titolo", value: "altro"},
                {pos:2, key: "pippo", value: "test"},
                {pos:3, key: "ancora", value: "prova"},
            ]
        },
        {step: 2, name: "fonte"},
        {step: 3, name: "festa"},
    ];

    //define step on click
    $scope.setStep = function(step) {
        $scope.current = step;
    }

  });
