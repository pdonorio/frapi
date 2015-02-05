'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:SubmissionController
 * @description
 * # SubmissionController
 * Controller of the yoApp
 */
myApp
.controller('SubmissionController', function ($rootScope, $scope, $stateParams, $filter, DataResource)
{

    //get url param
    var id = $stateParams.myId;
    $scope.id = id;

    //First step
    $scope.current = 1;

    //define step on click
    $scope.setStep = function(step) {
        $scope.current = step;
    }

    //////////////////////////////////////////////
    // SETUP data - read from API

    ////////////// READ STEPS
    DataResource.get("steps")    // Use the data promise
        .then(function(data) {  //Success
            console.log(data);
            //do modifications to $scope
        }, function(object) {      //Error
          console.log("Controller api call Error");
          console.log(object);
        }
    );

    ////////////// STEP template (inside code as i will always use this)
    $scope.formTemplate = [
        {pos:1, key: "titolo", type: "number"},
        {pos:2, key: "pippo", type: "select"},
        {pos:3, key: "ancora", type: "text"},
        {pos:4, key: "ultimo", type: "textarea"},
    ];

    ////////////// READ STEP CONTENT / TYPE

    // Missing for now

/*
//TO FIX:
* 1 - there should be one template per each step
* 2 - read from api: /step_template/#STEP_NUM
*/

    // Remove this very soon...

    $scope.steps = [
        {step: 1, name: "estratto",
            form: [
                {pos:1, key: "titolo", value: 3},
                {pos:4, key: "ultimo", value: "test"},
                {pos:3, key: "ancora", value: "<i>html</i>"},
                {pos:2, key: "pippo", value: "se moi"},
            ]
        },
        {step: 2, name: "fonte",
            form: [
                {pos:1, key: "titolo", value: 4},
                {pos:4, key: "ultimo", value: "test"},
                {pos:3, key: "ancora", value: "prova"},
            ]
        },
        {step: 3, name: "festa",
            form: [
                {pos:1, key: "titolo", value: 1},
                {pos:3, key: "ancora", value: "test"},
                {pos:2, key: "pippo", value: "riprova"},
            ]
        },
        {step: 4, name: "altro",
            form: [
                {pos:1, key: "titolo", value: 4},
                {pos:4, key: "ultimo", value: "test"},
                {pos:3, key: "ancora", value: "prova"},
            ]
        },
    ];

    //////////////////////////////////////////////
    // INIT EACH STEP

    $scope.bootData = [];

    for (var x = 0; x < $scope.steps.length; x++)
    {
        var step = $scope.steps[x];
        //fix data based on template
        //should be different for each step
        var template = $scope.formTemplate;

        //otherwise ng-repeat filters DO NOT WORK:
        var results = [];   //ARRAY and NOT JSON!!!!!

        //foreach template, get data and create new element in scope
        for (var j = 0; j < template.length; j++)
        {
            //get the position
            var tmp = template[j];
            var i = tmp.pos;

            //find existing data in that position
            var data = $filter('filter')(step.form, {pos: i});
            tmp.value = null;

            //if exists
            if (data && data.length > 0 && data[0].key == tmp.key) {
                //mix template with existing data inside results
                tmp.value = data[0].value;
            }
            //save results with key pos orderable
            results[j] = angular.copy(tmp);
        };

        //save step x
        $scope.bootData[x] = angular.copy(results);
    }
    //console.log($scope.bootData);
 });