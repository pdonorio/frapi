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
.controller('SubmissionAdminController', function ($scope, $state,
    NotificationData, AppConfig, ADMIN_USER,
    StepContent, StepTemplate, StepList )
{

    // Stop unwanted user
    if ($scope.username != ADMIN_USER)
        return false;
    $scope.myelement = null;

    // Objects / Models INIT
    var stepObj = StepList.build();
    var templObj = StepTemplate.build($scope.current);
    $scope.steps = [];
    // Try to load step list
    stepObj.getData().then(function(out) {
        // Set step list
        $scope.steps = out;
        // Try to load also template
        templObj.getData().then(function(response) {
            $scope.templates = response;
        });
        // Set number of steps somewhere
        $scope.stepsNum = $scope.steps.length;
    });

    ////////////////////////////////
    // STEP template EDITING

    /**************************/
    /*  TYPES   ***************/
// TO FIX -
    // Should be defined inside database?
    // Or inside configuration (app.conf)?
    $scope.types = [
        {value: 0, text: 'string'},
        {value: 1, text: 'number'},
        {value: 2, text: 'range'},
        {value: 3, text: 'date'},
        {value: 4, text: 'email'},
    ];
    /*  TYPES   ***************/
    /**************************/

    $scope.addTemplate = function() {
        var pos = 0;
        var label = 'nuovo elemento';
        var value = 0;  //first element: default
        // Find smallest position
        for (var j = 1; j < $scope.templates.length; j++) {
            if (!$scope.templates[j]) {
                pos = j;
                break;
            }
        };
        // Add template
        $scope.templates[pos] = {label:label, value:value};
        // API save
        templObj.setData($scope.current, pos, label, value)
        .then(function(id){
            console.log("Saved id", id);
        });
    };
    $scope.updateElement = function(index) {
        var l = $scope.templates[index].label;
        var v = $scope.templates[index].value;
        // API save
        templObj.setData($scope.current, index, l, v)
        .then(function(id){
            console.log("Updated id", id);
        });
    };
    $scope.removeElement = function(index) {
        delete $scope.templates[index];
        // API save
        templObj.unsetData($scope.current, index).then(function(){});
// TO FIX -
        //These should also remove every content set on this step:field from user...
    };

    //

    ////////////////////////////////
    // STEP name EDITING

    // Define step on click
    $scope.setStep = function(step) {
      $scope.snameform.$cancel();
      // Avoid if step has not changed
      if (step == $scope.current)
          return;
      // Set step for administration
      $scope.current = step;
    }
    // Save new name
    $scope.saveStepName = function() {
      stepObj.setData($scope.steps, $scope.current).then(function(check){
          NotificationData.setNotification(AppConfig.messageStatus.loading);
          if (check === false)
              NotificationData.setNotification(AppConfig.messageStatus.error,
                  "Database non raggiungibile");
          else
              NotificationData.setNotification(AppConfig.messageStatus.success,
                  "Elemento salvato");
      });
    }
    $scope.computeNextStep = function() {
      var pos = $scope.steps.length;
      // Find smallest position
      for (var j = 1; j < $scope.steps.length; j++) {
          if (!$scope.steps[j]) {
              pos = j;
              break;
          }
      };
      return pos;
    }
    // Add a step to database
    $scope.addStep = function() {
      var label = 'nuovo step';
      $scope.current = $scope.computeNextStep();
      // Add step
      $scope.steps[$scope.current] = label;
      // API save
      stepObj.setData($scope.steps, $scope.current).then(function(check){
          NotificationData.setNotification(AppConfig.messageStatus.loading);
          if (check === false)
              NotificationData.setNotification(AppConfig.messageStatus.error,
                  "Database non raggiungibile");
          else
              NotificationData.setNotification(AppConfig.messageStatus.success,
                  "Aggiunto step n." + $scope.current);
      });
    };
    $scope.removeStep = function(index) {

        var message = "Removing a complete step,\n" +
            "including content inserted by user so far...\n" +
            "Are you really sure?!?!";
// TO FIX -
// Are you really sure?
        if (confirm(message))
        {
            // Remove from array
            delete $scope.steps[index];
            //$scope.steps.splice(index, 1);
            var step = angular.copy($scope.current);

            // API PROMISE CHAINING
            // 1. Remove from API the step
            stepObj.unsetData(step); //.then(function(check){
// TO FIX -
            // 2. Remove from API steptemplate
            templObj.unsetData(step); //.then(function(check){
// TO FIX -
            // 3. Remove from API stepcontent
            var contObj = StepContent.build(null, step);
            contObj.unsetData(step);

            // Unselect steps in list
            $scope.current = null;
        }
    };

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
        angular.forEach(template, function(obj) {

            var value = null;
            if (notempty && content.values.length >= index) {
                value = content.values[index];
                if (value !== '') {
                    count++;
                }
            }
            //data[label] = value;
            data[index++] = {key: obj.label, value: value};
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