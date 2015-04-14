'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('SubmissionAdminController', function ($rootScope, $scope, $state,
    NotificationData, AppConfig, StepContent, StepTemplate, StepList )
{
    // Stop unwanted user
    if (!$scope.user.isAdmin())
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
      $state.go('logged.adminsubmission.step', {myId: 'admin', stepId: step});
    }
    // Define step from inside view
    $scope.setStep = function(step) {
      if (step < 1) {
        $scope.current = null
      // Avoid if step has not changed
      } else if (step != $scope.current) {
        // Set step for administration
        $scope.current = step;
      }
    }

    // Save new name
    $scope.saveStepName = function() {
      stepObj.setData($scope.steps, $scope.current, $rootScope.user.myid)
      .then(function(check){
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
      stepObj.setData($scope.steps, $scope.current, $rootScope.user.myid)
      .then(function(check){
          NotificationData.setNotification(AppConfig.messageStatus.loading);
          if (check === false) {
              NotificationData.setNotification(AppConfig.messageStatus.error,
                  "Database non raggiungibile");
          } else {
              NotificationData.setNotification(AppConfig.messageStatus.success,
                  "Aggiunto step n." + $scope.current);
              $scope.stepInUrl($scope.current);
          }
      });
    };
    $scope.removeStep = function(index) {

        var message = "Removing a complete step,\n" +
            "including content inserted by user so far...\n" +
            "Are you sure?!?!";
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
            stepObj.unsetData(step, $rootScope.user.myid).then(function(check){
              if (check === false) {
                NotificationData.setNotification(AppConfig.messageStatus.error,
                    "Database non raggiungibile");
              } else {

                // 2. Remove from API steptemplate
                $scope.templObj = StepTemplate.build(step, true);
                $scope.templObj.unsetData(step, null, $rootScope.user.myid).then();

                // 3. Remove from API stepcontent
                // Small note:
                // I will not remove user data related to these column,
                // as it could be usefull to make it show again
                // if admin recreates the same field again, with the same name

                NotificationData.setNotification(AppConfig.messageStatus.success,
                    "Rimosso step n." + step);
              }
            });

            // Unselect steps in list
            $scope.stepInUrl(0);
        }
    };

})

//////////////////////////////////////////////////////////////
.controller('SubmissionAdminStepController',
    function ($rootScope, $scope, $modal, $log, $filter, $stateParams, StepTemplate)
{
    if (!$scope.user.isAdmin())
        return false;

    // modal init
    var modalMessage = "Not defined yet";

    // Reset form if exists?
// TO FIX - does not work. Should be done onExit, but how?
    //$scope.snameform.$cancel();

    //INIT
    $scope.templates = [];
    // Apply current url step to whole view
    $scope.setStep($stateParams.stepId);

    ////////////////////////

    ////////////////////////
    if ($scope.current > 0) {
        console.log("Step", $scope.current);

        // Try to load also template
        $scope.templObj = StepTemplate.build($scope.current);
        // Types
        $scope.types = $scope.templObj.getTypes();
// TO FIX - make a $filter
        $scope.listType = 8; //$filter('list')($scope.types);
        $scope.reqopts = $scope.templObj.getOpts();

        //Define Modal
        modalMessage = "<table class='table'>";
        angular.forEach($scope.types, function(element, index){
            //$log.info("Element "+index);
            modalMessage +=
                '<tr>'
                + "<th>"+element.text+" </th>"
                + "<td>"+element.desc+"</td>"
                + '</tr>';
            //console.log(element);
        });
        modalMessage += '</table>';
        modalMessage =
            '<div class="modal-header"> ' +
            '<h3 class="modal-title">Available types</h3>' +
            '</div>' +
            '<div class="modal-body"> ' + modalMessage + ' </div>'+
            '';

        // Load templates
        $scope.templObj.getData().then(function(response) {
            if (response.length) {
                console.log("Loading", response);
                $scope.templates = response;
                //for each? // hashStatus
            }
        });
    }


    ////////////////////////////////
    // STEP template EDITING
    $scope.addTemplate = function() {
      var pos = $scope.templates.length;
      // Find smallest position
      for (var j = 1; j < $scope.templates.length; j++) {
        if (!$scope.templates[j]) {
          pos = j;
          break;
        }
      };
      if (pos < 1) pos = 1;

      // Add template
      var label = 'nuovo ' + pos;
      var value = 0;
      $scope.templates[pos] = {
        label: label, value: value,
        extra:null, required: 0, hash: 'new',
        hashStatus: 'new',
      };
      // API save
      if (!$scope.templObj)
          $scope.templObj = StepTemplate.build($scope.current);
      $scope.templObj.setData($rootScope.user.myid, $scope.current, pos,label,value,value)
        .then(function(tmp){
            $scope.templates[pos].hash = tmp.hash;

        });
    };
    $scope.updateElement = function(index) {
      // Select might be empty
      var val = 1;
      if ($scope.templates[index].myselect)
        val = $scope.templates[index].myselect.value;
      // Get values from index
      var lab = $scope.templates[index].label;
      var req = $scope.templates[index].required;
      var ex = $scope.templates[index].extra;
      // API save
      $scope.templObj.setData($rootScope.user.myid, $scope.current, index, lab, val, req, ex)
        .then(function(tmp){

            // add check for hash status
            if ($scope.templObj.checkHash())
                $scope.templates[index].hashStatus = 'existing';
            else
                $scope.templates[index].hashStatus = 'new';
            $scope.templates[index].hash = tmp.hash;
        });
    };
    $scope.removeElement = function(index) {
      delete $scope.templates[index];
      // API save
      $scope.templObj.unsetData($scope.current, index, $rootScope.user.myid)
       .then(function(check){});

      // Small note (hashStatus):
      // I will not remove user data related to these column,
      // as it could be usefull to make it show again
      // if admin recreates the same field again, with the same name
    };

    $scope.checkIfNameExist = function(name, pos) {
        return $scope.templObj.checkLabel(name, $scope.current, pos)
        .then(function(response){
            if (response)
                return "Il nome '"+name+"' viene gia' utilizzato";
            return true;
        });
    }

    $scope.checkList = function(data) {
        var msg = "Lista di valori separati da virgola (almeno 2)";

        if (!data || data == '')
            return msg;
        var list = data.split(',');
        var count = 0;
        angular.forEach(list, function(val, key){
            if (val != '') {
                count++;
            }
        });
        if (count < 2)
            return msg;
        //console.log(data);
    };

    /////////////////////////////////
    // Modal

    $scope.open = function (size) {
      // get instance
      var modalInstance = $modal.open({
        template: modalMessage,
        backdrop: true,
      });
      //after closing
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

})

//////////////////////////////////////////////////////////////
; //end of controllers