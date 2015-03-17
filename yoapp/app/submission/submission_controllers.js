'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('SubmissionController', function ($scope, $state, $stateParams, $timeout, NotificationData, AppConfig, StepList, draft)
{
    ////////////////////////////////
    // Do not start with a current value as default (Let the URL decide)
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
    if (draft)
        console.log("Obtained draft id", draft);
    // 2. Switch to edit of the new dratf + step 1 (default if not set)
    if (draft !== null) {
        $timeout( function() {
            $state.go('logged.submission.step', { myId: draft});
// TO FIX -
        }, 1600);
    } else {
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
.controller('StepController', function ($scope, $stateParams)
{
    $scope.setStep($stateParams.stepId);
})

//////////////////////////////////////////////////////////////
.controller('StepDirectiveController', function (
    $rootScope,
    $scope, $timeout, directiveTimeout, NotificationData, AppConfig,
    StepTemplate, StepContent, IdProvider)
{

    ////////////////////////////////////////////////
    // Build objects
    $scope.data = [];
    $scope.contentData = StepContent.build($scope.identifier, $scope.step);

    ////////////////////////////////////////////////
    // Procedure to mix data and save it into scope
    var injectData = function(template, content)
    {
        // var init
        var index = 0;
        var count = 0;
        var data = [];
        var notempty = content.values && content.values.length;

        if (notempty && content.id)
            $scope.contentData.setId(content.id);
        // Mixing template and content here
        angular.forEach(template, function(obj) {

            var content = null;
            if (notempty && content.values.length >= index) {
                content = content.values[index];
                if (content !== '')
                    count++;
            }

            var type = $scope.types[0].text;
            if ($scope.types[obj.value])
                type = $scope.types[obj.value].text;
            //obj.value

            data[index++] = {key: obj.label, type: type, value: content};
        });
// TO FIX
        $scope.data[$scope.step] = data;
        return count;

    }

    ////////////////////////////////////////////////
    // FIRST TIME: get data if not 'new' in address bar
    // Get StepTemplate (admin data)
    var templObj = StepTemplate.build($scope.step);
    $scope.types = templObj.getTypes();
    templObj.getData().then(function(template)
    {
        // Set error if empty template on this step...
        if (template.length < 1)
            return false;

        // Load only data for current identifier, see build of the class
        $scope.contentData.getData().then(function(content)
        {
            // Create data from models and inject the result inside scope
            var count = injectData(template, content);
            // Decide on form to show
            if ($scope.step == $scope.current)
            {
                console.log("Activated step:", $scope.step);
                // Open form
                if ($scope.myform && count < 1) {
                    $scope.myform.$show();
                }
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
    // Validating data before saving
    $scope.checkData = function(data, type) {
        if (!data) {
          return "Please insert some value";
        } else if (type == 'string') {
          return true;
        } else if (type == 'number') {
          return true;
        } else if (type == 'email') {
          return true;
        }
        // Validation
        console.log("Check data!");
        console.log(data);
        // if returning a string form gives an error
        return "No checks defined yet on type '"+type+"'";
    }
    // Save button
    $scope.saveStep = function() {

// REMOVE ME
        console.log("Debug save");
        console.log($scope.data);
        console.log($rootScope.user);
        console.log($scope.identifier);
        return true;
// REMOVE ME
        // Signal that we are going to try to edit data
        NotificationData.setNotification(AppConfig.messageStatus.loading);

        // Try to save data. Also this has to be a promise
        // if i want to handle notification at this level
        $scope.contentData.setData($scope.data, $rootScope.user.name, $scope.identifier)
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
                templObj.getData().then(function(template){
                    injectData(template, backup);
                });
            }
         });
    }

}) //end StepController

//////////////////////////////////////////////////////////////
; //end of controllers