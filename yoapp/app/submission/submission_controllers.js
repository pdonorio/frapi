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
    $scope, $timeout, directiveTimeout,
    StepTemplate, StepContent
    )
{

    // If working on empty step as first, show already the form
    if ($scope.id == 'new' && $scope.step == $scope.current) {

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

    $scope.stepContent = [];
    $scope.stepCopy = [];
    $scope.undoStep = function() {
        // Recover the array copied
        $scope.stepContent = angular.copy($scope.stepCopy);
        // Abort the current form
        $scope.myForm.$cancel();
    };
    $scope.saveStep = function() {
        // Signal that we are going to try to edit data
        //NotificationData.setNotification(AppConfig.messageStatus.loading, "");
        console.log("TEST");
    }

    // StepTemplate (admin structure)
    $scope.templateModel = StepTemplate.build($scope.step);
    $scope.templateModel.getData().then(function(tout) {

        // TO GET DATA PER EACH OBJECT (when activated)
        var template = tout;

        //////////////////////
        // DEBUG
        if ($scope.step == $scope.current) {
            console.log("Activated step ", $scope.step)
        }
        // DEBUG
        //////////////////////

    // StepContent (center data)
          $scope.contentData = StepContent.build($scope.step);
          $scope.contentData.getData().then(function(cout) {
            var content = cout;
            //console.log(content);
/*
                // Pad
                var pad = "000";
                var str = "" + 1;
                var field = 'field' + pad.substring(0, pad.length - str.length) + str
                console.log(field);
*/
            // Mixing template and content here
            console.log("Step "+$scope.step);
            angular.forEach(template, function(type, label) {
                console.log(label + ":" + type);
            });
/*
            var data = {};
            // The main part
            data[tmpl.key] = value;
            // TEST
            $scope.stepsData[step] = data;
            //console.log($scope.stepsData);
*/


          });   //content end
        });     //template end

}) //end StepController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
; //end of controllers