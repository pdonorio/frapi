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

// TO FIX - should get the step from url/routing
    //First step
    $scope.current = 1;
    //define step on click
    $scope.setStep = function(step) {
        $scope.current = step;
    }

    $scope.steps = [];

    ////////////// READ STEP CONTENT / TYPE
    // Missing for now?
    // Should also build template based on type per each step....

    //////////////////////////////////////////////
    // STEP template
    $scope.formTemplate = [
        {pos:1, key: "titolo", type: "number"},
        {pos:2, key: "pippo", type: "select"},
        {pos:3, key: "ancora", type: "text"},
        {pos:4, key: "ultimo", type: "textarea"},
    ];

    // INIT EACH STEP
    $scope.bootData = [];

    function fillStepData() {

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

    }

    //////////////////////////////////////////////
    // SETUP data - read from API
    DataResource.get("steps")    // Use the data promise
     .then(function(data) {  //Success
        for (var i = 0; i < data.count; i++) {
            var x = data.items[i];
            var tmp = { step: x.step, name: x.label, form: [
                        {pos:1, key: "titolo", value: 3},
                        {pos:4, key: "ultimo", value: "test"},
                        {pos:3, key: "ancora", value: "<i>html</i>"},
                        {pos:2, key: "pippo", value: "se moi"},
                    ]
                };
            //do modifications to $scope
            $scope.steps.push(tmp);
        };

        // Use the data since it is finally available
        fillStepData();

     }, function(object) {      //Error
      console.log("Controller api 'steps' call Error");
      console.log(object);
     }
    );

    //////////////////////////////////////////////
 });