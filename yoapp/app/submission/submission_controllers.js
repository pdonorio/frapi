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
    // Factory/Service with models
    StepTemplate, StepList, StepContent)
{
    ////////////////////////////////
    // get variable inside url as param
    var id = $stateParams.myId;
    // Inject for DOM
    $scope.id = id;
    $scope.current = null;

    ////////////////////////////////
    // STEPS EDITABLE

    // Init
    $scope.steps = [];
    $scope.stepsCopy = [];
    // Manage switch?
    $scope.$on('switch', function(event, enabled) {
        // Something?
    });
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
    $scope.stepObj.list.getData().then(function(out){
      //console.log("List");
      $scope.steps = out;

    // StepTemplate (admin structure)
      $scope.stepObj.template = StepTemplate.build();
      $scope.stepObj.template.getData().then(function(out){
          //console.log("Template");
          var template = out;
          // For future ADMIN
          $scope.templateData = out;

    // StepContent (center data)
          $scope.stepObj.content = StepContent.build();
          $scope.stepObj.content.getData().then(function(out){
            //console.log("Content");
            var content = out;

            //////////////////////////////////////////////////
            // Mixing template and content here
            template.forEach(function(obj, step) {
              if (!obj) return;
              var data = {};

              obj.forEach(function(tmpl, position) {
                if (tmpl.length < 1) return;
                var value = null;

                // The main part
                if (content[step][position])
                    if (content[step][position].key == tmpl.key)
                        if (content[step][position].value)
                            value = content[step][position].value;
                // The main part

                data[tmpl.key] = value;
              });

              $scope.stepsData[step] = data;
            });
            //console.log($scope.stepsData);
            $scope.stepsNum = Object.keys($scope.stepsData).length;
            //////////////////////////////////////////////////

          });   //content end
        });     //template end
    });         //list end
    // END OF DATA WORKING

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
.controller('StepDirectiveController', function ($scope, $timeout, directiveTimeout)
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

    // Should be defined outside and passed here as reference?
    $scope.doSomethingToSave = function() {
        console.log("Saving user edit");
    }

}) //end StepController

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
; //end of controllers