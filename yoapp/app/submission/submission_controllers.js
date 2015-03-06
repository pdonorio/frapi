'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
.controller('SubmissionController', function (
    $scope, $state, $stateParams, $timeout,
    NotificationData, AppConfig, StepList, draft)
{

    ////////////////////////////////
    // Do not start with a current value as default
    // Let the URL decide
    $scope.current = null;

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
    ////////////////////////////////
    // The IDENTIFIER ***

    // I want to always be in EDIT mode!
    // difference from draft and completed is the 'published' field

    // 0. Inject to all DOM elements
    // get variable inside url as param
    $scope.myrecordid = $stateParams.myId;

    // 1. If id is 'new' get the identifier and set it inside the URL
    // This was moved to the resolve part in the routing section
    //console.log("Obtained draft id", draft);

    // 2. Switch to edit of the new dratf + step 1 (default if not set)
    if (draft !== null) {

        $timeout( function() {
            $state.go('logged.submission.step', { myId: draft});
// TO FIX -
        }, 1600);

    } else {

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

    }

 }) //end SubmissionController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
.controller('SubmissionAdminController', function ($scope, $state, StepList)
{

//DEBUG
    $scope.current = 2;
//DEBUG

    if ($scope.username != 'admin')
        return false;
    // StepList (side navbar)
    var stepObj = StepList.build();
    $scope.steps = [];
    stepObj.getData().then(function(out) {
        //console.log("List");
        $scope.steps = out;
        console.log($scope.steps);
        //$scope.stepsNum = Object.keys($scope.stepsData).length;
        $scope.stepsNum = $scope.steps.length;
    });


    ////////////////////////////////
    // STEPS (list) EDITABLE
    $scope.newsteps = 1;
    //define step on click
    $scope.setStep = function(step) {
        if (step == $scope.current)
            return;
        $scope.current = step;
        console.log("Step",step);
    }
    $scope.addStep = function() {
        var label = 'nuovo_' + $scope.newsteps++;
        // Add step
        $scope.steps.push(label);
        // Select the step right after
        $scope.current = $scope.steps.length - 1;
        // API save?
    };
    $scope.removeStep = function(index) {
// Are you really sure?
// Are you really sure?

        // Remove from array
        $scope.steps.splice(index, 1);
        // Unselect steps in list
        $scope.current = null;

        // API PROMISE CHAINING
        // 1. Remove from API the step
        // 2. Remove from API steptemplate
        // 3. Remove from API stepcontent
    };
/*
    $scope.saveStep = function() {
        console.log("Call me to save");
        // Note to self:
        // i should reload the view which shows the step contents!
        $state.go('logged.submission');
    }

    // ????
    $scope.stepsCopy = [];
    $scope.undoSteps = function() {
        // Recover the array copied
        $scope.steps = angular.copy($scope.stepsCopy);
        // Abort the current form
        $scope.stepsForm.$cancel();
        closingAction();
    };
*/
})

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
    $scope, $timeout, directiveTimeout, NotificationData, AppConfig,
    StepTemplate, StepContent, IdProvider)
{

    ////////////////////////////////////////////////
    // Build objects
    var data = {};
    $scope.contentData = StepContent.build($scope.identifier, $scope.step);
    $scope.templateModel = StepTemplate.build($scope.step);

    ////////////////////////////////////////////////
    // Procedure to mix data and save it into scope
    var injectData = function(template, content, notempty) {

        // var init
        var index = 0;
        var count = 0;
        if (notempty && content.id)
            $scope.contentData.setId(content.id);
        // Mixing template and content here
        angular.forEach(template, function(type, label) {
            var value = null;
            if (notempty && content.values.length >= index) {
                value = content.values[index];
                if (value !== '') {
                    count++;
                }
            }
            //data[label] = value;
            data[index++] = {key: label, value: value};
        });

        //$timeout( function() {
            $scope.data = data;
        //}, 350);

        return count;

    }

    ////////////////////////////////////////////////
    // FIRST TIME: get data if not 'new' in address bar
    // Get StepTemplate (admin data)
    $scope.templateModel.getData().then(function(template)
    {
        // Set error if empty template on this step...
        if (template.length < 1)
            return false;

        // Load only data for current identifier, see build of the class
        $scope.contentData.getData().then(function(content)
        {
            var notempty = content.values && content.values.length;
            // Create data from models and inject the result inside scope
            var count = injectData(template, content, notempty);

            // Decide on form to show
            if ($scope.step == $scope.current)
            {
                // Open form
                if ($scope.myform && count < 1) {
                    $scope.myform.$show();
                }
                //console.log("Activated step:", $scope.step);
            }
        });
     });

    ////////////////////////////////////////////////
    // OPERATIONs:

    // Cancel button
    $scope.undoStep = function() {
        // Abort the current form
        $scope.myForm.$cancel();
    };
    // Save button
    $scope.saveStep = function() {
        // Signal that we are going to try to edit data
        NotificationData.setNotification(AppConfig.messageStatus.loading);

        // Try to save data. Also this has to be a promise
        // if i want to handle notification at this level
        $scope.contentData.setData($scope.data, $scope.username, $scope.identifier)
         .then(function(success) {
            if (success) {
                $timeout( function() {
                    NotificationData.setNotification( AppConfig.messageStatus.success,
                        "Salvataggio riuscito");
                }, 800);
            } else {
                NotificationData.setNotification( AppConfig.messageStatus.error,
                    "Il servizio dati non é raggiungibile");
                // Bring data back?
                var backup = $scope.contentData.restoreBackup();
                // Template is a promise...
                $scope.templateModel.getData().then(function(template){
                    injectData(template, backup);
                });
            }
         });
    }

}) //end StepController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

; //end of controllers