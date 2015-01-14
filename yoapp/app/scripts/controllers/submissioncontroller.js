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

    $scope.formTemplate =
        [
            {pos:1, key: "titolo", type: "number"},
            {pos:2, key: "pippo", type: "select"},
            {pos:3, key: "ancora", type: "text"},
            {pos:4, key: "ultimo", type: "textarea"},
        ];

    $scope.current = 1;
    $scope.steps = [
        {step: 1, name: "estratto", form: [
            {pos:1, key: "titolo", value: 4},
            {pos:4, key: "ultimo", value: "test"},
            {pos:3, key: "ancora", value: "prova"},
        ] },
        {step: 2, name: "fonte", form: []},
        {step: 3, name: "festa", form: []},
    ];

    //define step on click
    $scope.setStep = function(step) {
        $scope.current = step;
    }

  });
