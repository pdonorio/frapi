'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:SubmissionController
 * @description
 * # SubmissionController
 * Controller of the yoApp
 */
myApp

.controller('SubmissionController', function (
    $rootScope, $scope, $state, $stateParams, $filter,
    NotificationData, AppConfig,
    // Factory/Service with models
    StepList
    //,StepContent, StepTemplate
    )
{
    ////////////////////////////////
    // get variable inside url as param
    var id = $stateParams.myId;
    // Inject for DOM
    $scope.id = id;
    $scope.current = null;

    ////////////////////////////////
    // STEPS (list) EDITABLE

    // Init
    $scope.steps = [];
    $scope.stepsCopy = [];
    var closingAction = function() {
        $state.go('logged.submission');
    }
    $scope.undoSteps = function() {
        // Recover the array copied
        $scope.steps = angular.copy($scope.stepsCopy);
        // Abort the current form
        $scope.stepsForm.$cancel();
        closingAction();
    };
    $scope.saveSteps = function() {
        console.log("Call me to save");
        // Note to self:
        // i should reload the view which shows the step contents!
        $state.go('logged.submission');
    }
    $scope.removeStep = function(index) {
        $scope.steps.splice(index, 1);
    };
    $scope.addStep = function() {
        var newStep = {
          id: null,
          step: $scope.steps.length + 1,
          label: 'nuovo',
        };
        $scope.steps.push(newStep);
    };

    ////////////////////////////////
    // STEPS as a parameter for the whole view
    //define step on click
    $scope.broadcastStep = function(step) {
        $state.go('logged.submission.step', {stepId: step});
    }
    // A function for the child to update the main step
    $scope.setStep = function(step) {
        // Coming as an url parameter i have to make sure is not a string
        $scope.current = parseInt(step);
    }

    //////////////////////////////////////////////
    // Getting data from my Models
    $scope.stepObj = {};
    $scope.stepsData = {};

    // StepList (side navbar)
    $scope.stepObj.list = StepList.build();
    $scope.stepObj.list.getData().then(function(out) {
        //console.log("List");
        $scope.steps = out;
        //$scope.stepsNum = Object.keys($scope.stepsData).length;
        $scope.stepsNum = $scope.steps.length;
    });

 }) //end SubmissionController


//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
.controller('StepController', function ($scope, $stateParams)
{

    $scope.setStep($stateParams.stepId);

    // this does not work for the parent!
    //$scope.current = $stateParams.stepId;

}) //end StepController


//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
.controller('StepDirectiveController', function (
    $scope, $timeout, directiveTimeout, NotificationData, AppConfig, fieldPad,
    StepTemplate, StepContent
    )
{

    // If working on empty step as first, show already the form
    if ($scope.id == 'new' && $scope.step == $scope.current) {

        // Things here get a little complicated...

        // When the timeout is defined, it returns a promise object.
        var timer = $timeout( function() {
            if ($scope.myform) $scope.myform.$show();
        }, directiveTimeout);
        // Let's bind to the resolve/reject handlers
        timer.then( function() { ; }, function() {
            console.log( "Timer rejected!", Date.now() );
        });
        // When the DOM element is removed from the page
        $scope.$on( "$destroy", function( event ) { $timeout.cancel( timer ); });

    }


    // Build objects
    var data = {};
    $scope.templateModel = StepTemplate.build($scope.step);
    $scope.contentData = StepContent.build($scope.step);

    // Cancel button
    $scope.undoStep = function() {
        // Abort the current form
        $scope.myForm.$cancel();
    };
    // Save button
    $scope.saveStep = function() {
        // Signal that we are going to try to edit data
        //NotificationData.setNotification(AppConfig.messageStatus.loading, "");
        // Try to save data
        var saving = $scope.contentData.setData($scope.data);
    }

    // Get StepTemplate (admin data)
    $scope.templateModel.getData().then(function(tout) {

        //console.log("Step "+$scope.step);
        var template = tout;
        if (tout.length < 1)
            return false;

        // Get StepContent (user data)
        $scope.contentData.getData().then(function(cout) {

            // var init
            var counter = 0;
            var content = cout;
            if (cout.length > 0 && cout.id)
                $scope.contentData.setId(cout.id);

            // Mixing template and content here
            angular.forEach(template, function(type, label) {
                var value = null;
                counter++;
                var str = String(counter);
                var field = 'field' + fieldPad.substring(0, fieldPad.length - str.length) + str;
                // console.log(label + ":" + type);
                // if (content[field]) console.log(content[field]);
                if (content[field]) {
                    value = content[field];
                }
                data[label] = value;
            });

            if (Object.keys(data).length > 0)
                $scope.data = data;

            // DEBUG
            // if ($scope.step == $scope.current)
            //     console.log("Activated step ", $scope.step)

          });   //content end
        });     //template end

}) //end StepController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
; //end of controllers