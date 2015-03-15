'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('SubmissionAdminController', function ($scope, $state,
    NotificationData, AppConfig, ADMIN_USER,
    StepContent, StepTemplate, StepList )
{

    // Stop unwanted user
    if ($scope.username != ADMIN_USER)
        return false;

    // Objects / Models INIT
    $scope.myelement = null;
    var stepObj = StepList.build();
    $scope.steps = [];

    // Try to load step list
    stepObj.getData().then(function(out) {
        if (out) {
            // Set step list
            $scope.steps = out;
            $scope.templObj = StepTemplate.build($scope.current);
            // Set number of steps somewhere
            $scope.stepsNum = $scope.steps.length;
        }
        // Unselect if trying to reach a non existing step
        if (!$scope.steps[$scope.current])
          $scope.stepInUrl(0);
    });

    ////////////////////////////////
    // STEP name EDITING

    // Define step on click
    $scope.stepInUrl = function(step) {
      $state.go('logged.adminsubmission.step', {stepId: step});
    }
    // Define step from inside view
    $scope.setStep = function(step) {
      if (step < 1)
        $scope.current = null
      // Avoid if step has not changed
      else if (step != $scope.current)
        $scope.current = step; // Set step for administration
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
              pos = j; break;
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
            stepObj.unsetData(step).then(function(check){
              if (check === false) {
                NotificationData.setNotification(AppConfig.messageStatus.error,
                    "Database non raggiungibile");
              } else {

// TO FIX -
                // 2. Remove from API steptemplate
                $scope.templObj.unsetData(step); //.then(function(check){
                // 3. Remove from API stepcontent
                var contObj = StepContent.build(null, step);
                contObj.unsetData(step);
// TO FIX -

                NotificationData.setNotification(AppConfig.messageStatus.success,
                    "Rimosso step n." + $scope.current);
              }
            });

            // Unselect steps in list
            $scope.stepInUrl(0);
        }
    };

})

//////////////////////////////////////////////////////////////
.controller('SubmissionAdminStepController',
    function ($scope, $stateParams, StepTemplate)
{
    $scope.setStep($stateParams.stepId);
    if ($scope.current > 0) {
        console.log("Step", $scope.current);

        // Try to load also template
        $scope.templObj = StepTemplate.build($scope.current);
        $scope.templObj.getData().then(function(response) {
            if (response.length)
                $scope.templates = response;
        });
    }
// TO FIX -
    //$scope.snameform.$cancel();

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
    /**************************/

    $scope.addTemplate = function() {
      var pos = 1;
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
      $scope.templObj.setData($scope.current, pos,label,value).then(function(id){});
    };
    $scope.updateElement = function(index) {
      var l = $scope.templates[index].label;
      var v = $scope.templates[index].value;
      // API save
      $scope.templObj.setData($scope.current, index, l, v).then(function(id){});
    };
    $scope.removeElement = function(index) {
      delete $scope.templates[index];
      // API save
      $scope.templObj.unsetData($scope.current, index).then(function(){});
// TO FIX -
      //These should also remove every content set on this step:field from user...
    };
})

//////////////////////////////////////////////////////////////
; //end of controllers