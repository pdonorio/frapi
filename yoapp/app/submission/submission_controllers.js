'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
.controller('SubmissionController', function (
    $rootScope, $scope, $state, $stateParams, $filter, $timeout,
    user, NotificationData, AppConfig, StepList, draft)
{

    ////////////////////////////////
    // Do not start with a current value as default
    // Let the URL decide
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
    ////////////////////////////////
    // The IDENTIFIER ***

    // I want to always be in EDIT mode!
    // difference from draft and completed is the 'published' field

    // 0. Inject to all DOM elements
    // get variable inside url as param
    $scope.myrecordid = $stateParams.myId;

    // 1. If id is 'new' get the identifier and set it inside the URL
    // This was moved to the resolve part in the routing section
    console.log("Obtained", draft);

    // 2. Switch to edit of the new dratf + step 1 (default if not set)
    if (draft !== null) {
        $timeout( function() {
            $state.go('logged.submission.step', { myId: draft});
// TO FIX -
        }, 1800);
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
    var data = [];
    $scope.contentData = StepContent.build($scope.step);
    $scope.templateModel = StepTemplate.build($scope.step);

    ////////////////////////////////////////////////
    // Procedure to mix data and save it into scope
    var injectData = function(template, content) {

        // var init
        var counter = 0;
        var notempty = content.values && content.values.length;
        if (notempty && content.id)
            $scope.contentData.setId(content.id);
        // Mixing template and content here
        angular.forEach(template, function(type, label) {
            var value = null;
            if (notempty && content.values.length >= counter) {
                value = content.values[counter];
            }
            //data[label] = value;
            data[counter++] = {key: label, value: value};
        });

        // If i have data: send it to DOM scope
        if (Object.keys(data).length > 0)
            $scope.data = data;

    }

    ////////////////////////////////////////////////
    // FIRST TIME: get data if not 'new' in address bar
    // Get StepTemplate (admin data)
    $scope.templateModel.getData().then(function(template) {
        // Set error if empty template on this step...
        if (template.length < 1)
            return false;
        // Load only data for current identifier
        var content = $scope.contentData.getData();
        // Create data from models and inject the result inside scope
        injectData(template,content);
     });

    ///////////////////////////////////////////////////////////
// UHM NON FUNZIONA.
// SERVE UN NUOVO DISCRIMINANTE
    var new_draft = $scope.id == 'new';
    //var new_draft = ($scope.id == 'new');

    // Decide on form to show
    if ($scope.step == $scope.current)
    {
        console.log("Activated step: "+ $scope.step);
        console.log("Check identifier: " + $scope.identifier);

        // OPEN FORM
        // Timer is necessary to make sure that the compiled directive
        // gets the necessary data before action
        $timeout( function() {
            if ($scope.myform) $scope.myform.$show();
        }, directiveTimeout);
    }

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

        // Identifier is a promise
        $scope.pid.getId(user)
         .then(function(identifier) {

            // Try to save data. Also this has to be a promise
            // if i want to handle notification at this level
            $scope.contentData.setData($scope.data, user, identifier)
             .then(function(success) {
                if (success) {
                    NotificationData.setNotification( AppConfig.messageStatus.success,
                        "Salvataggio riuscito");
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
         });
    }

}) //end StepController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

; //end of controllers