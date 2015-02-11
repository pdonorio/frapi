'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:SubmissionController
 * @description
 * # SubmissionController
 * Controller of the yoApp
 */
myApp
.controller('SubmissionController', function ($rootScope, $scope, $state, $stateParams, $filter,
    // Factory/Service with models
    StepList
){

    ////////////////////////////////
    // get variable inside url as param
    var id = $stateParams.myId;
    // Inject for DOM
    $scope.id = id;

    ////////////////////////////////
    // STEPS EDITABLE

    // Init
    $scope.steps = [];
    $scope.stepsCopy = [];

    // Manage switch to enable edit form (for ADMIN)
    $scope.$on('switch', function(event, enabled) {
        // Copy data when enabling changes
        if (enabled) {
            $scope.stepsCopy = angular.copy($scope.steps);
            // Show the form for changes
            $scope.stepsForm.$show();
        } else {
            // Close the form for changes
            $scope.stepsForm.$hide();
        }
    });
    // closing actions
    var closingAction = function() {
        $state.go('logged.submission');
        return true;
    }
    // undo
    $scope.undoSteps = function() {
        // Recover the array copied
        $scope.steps = angular.copy($scope.stepsCopy);
        // Abort the current form
        $scope.stepsForm.$cancel();
        return closingAction();
    };
    // save
    $scope.saveSteps = function() {

        console.log("Call me to save");
        // Note to self:
        // i should reload the view which shows the step contents!
        $state.go('logged.submission');
    }
    // remove
    $scope.removeStep = function(index) {
        $scope.steps.splice(index, 1);
    };
    // add
    $scope.addStep = function() {
        var newStep = {
          id: null,
          step: $scope.steps.length + 1,
          label: 'nuovo',
        };
        $scope.steps.push(newStep);
    };

// TO FIX - should get the step from url/routing
    //First step
    $scope.current = 1;
    //define step on click
    $scope.setStep = function(step) {
        //console.log("Entering step ", step);
        $scope.$broadcast('formActivation', false);
        $scope.current = step;
    }

    // If working on empty step as first, show already the form
    if ($scope.id == 'new') {
        // Send the same event to every child controller/scope listening
        $scope.$broadcast('formActivation', true);
    }

    ////////////// READ STEP CONTENT / TYPE
    // Missing for now?
    // Should also build template based on type per each step....

    //////////////////////////////////////////////
    // STEP template
    $scope.formTemplate = [
        {pos:1, key: "titolo", type: "number", value: 3},
        {pos:2, key: "pippo", type: "select", value: ['first','second']},
        {pos:3, key: "ancora", type: "text", value: 'string'},
        {pos:4, key: "ultimo", type: "textarea", value: 'alongerstring'},
    ];

    //////////////////////////////////////////////
    // NEW WAY
    //var obj = Submission.build(); $scope.tmp = obj.get();
    var steps = StepList.build();
    steps.getData().then(function(out){
        console.log("Controller");
        console.log(out);
        $scope.steps = out;
    });


 });