'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
.controller('SubmissionController', function (
    $rootScope, $scope, $state, $stateParams, $filter,
    NotificationData, AppConfig, StepList)
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
    $scope, $timeout, directiveTimeout, NotificationData, AppConfig,
    StepTemplate, StepContent, IdProvider)
{
    // TO FIX!
    var user = 'admin';

    // If working on empty step as first, show already the form
    if ($scope.id == 'new' && $scope.step == $scope.current) {

        // Register a new identifier for this draft
        $scope.pid = IdProvider.build();
        $scope.pid.getId(user).then(function(id){
            console.log("New id: "+id);
            $scope.record = id;
        });

        // Timer is necessary to make sure that the compiled directive
        // gets the necessary data before action
        $timeout( function() {
            if ($scope.myform) $scope.myform.$show();
        }, directiveTimeout);
    }

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
    // Cancel button
    $scope.undoStep = function() {
        // Abort the current form
        $scope.myForm.$cancel();
    };
    ////////////////////////////////////////////////
    // Save button
    $scope.saveStep = function() {
        // Signal that we are going to try to edit data
        NotificationData.setNotification(AppConfig.messageStatus.loading);

        $scope.pid.getId(user).then(function(identifier){

            // Try to save data
            $scope.contentData.setData($scope.data, user, identifier)
             .then(function(success) {
                if (success) {
                    NotificationData.setNotification(AppConfig.messageStatus.success,
                        "Salvataggio riuscito");
                } else {
                    NotificationData.setNotification(AppConfig.messageStatus.error,
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

    ////////////////////////////////////////////////
    // FIRST TIME: get data
    // Get StepTemplate (admin data)
    $scope.templateModel.getData().then(function(template) {

        if (template.length < 1)
            return false;
        // Get StepContent (user data)
        var content = $scope.contentData.getData();
        // Do not stop if content is empty, as user will submit data for it
        injectData(template,content);

        // DEBUG
        //console.log($scope.data);
        if ($scope.step == $scope.current) {
            console.log("Activated step ", $scope.step);
            //open form?
        }

    });     //template end

}) //end StepController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

; //end of controllers