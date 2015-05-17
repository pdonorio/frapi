'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('SubmissionController', function (
    $rootScope, $scope, $state, $stateParams, $timeout, $modal,
    Logger, NotificationData, AppConfig, StepList, draft, DocumentsFactory )
{
    ////////////////////////////////
    // Do not start with a current value as default (Let the URL decide)
    $scope.current = null;
    var logger = Logger.getInstance('submission_main');

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
    $rootScope.myrecordid = $stateParams.myId;
    // 1. If id is 'new' get the identifier and set it inside the URL
    // This was moved to the resolve part in the routing section
    if (draft)
        logger.info("Obtained draft id: " + draft);
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

    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    var refreshDocs = function(){
        DocumentsFactory.get($scope.myrecordid).then(function(data){
            //console.log("Received", data);
            $scope.docs = data;
        });
    }
    // Available also for uploader controller...
    $rootScope.refreshDocs = refreshDocs;

    $scope.removeDoc = function(id, fname) {
        logger.info("Removing " + id);
        DocumentsFactory.unset(id, fname).then(function(docs){ refreshDocs(); });
    }

    // Modal
    $scope.openModal = function (fileid) {

      logger.debug("Opened file: " + fileid);

      var modalInstance = $modal.open({
        size: 'lg',
        // Html template
        templateUrl: 'upload/manage_files.html',
        // Use transcript resource
        controller: function($rootScope, $scope, $modalInstance, Logger, DocumentsFactory, focus) {

            var logger = Logger.getInstance('transcr_modal');
            $scope.selectedFile = fileid;

            var refresh = function() {
                logger.debug("Refresh views");
                DocumentsFactory.getTranscription(fileid).then(function(resp){
                    if (!resp.transcriptions)
                        resp.transcriptions = [];
                    $scope.trans = resp.transcriptions;

                    $scope.editor = [];
                    for (var j = 0; j < $scope.trans.length; j++) {
                        if ($scope.trans[j] == '')
                            $scope.trans.splice(j, 1);
                        else
                            $scope.editor[j] = false;
                    };
                    // refresh main view
                    refreshDocs();
                });
            }
            var update = function() {
              DocumentsFactory.setTranscriptions(
                $scope.selectedFile, $scope.trans).then(function(){refresh()});
            }
            //first time
            refresh();

            $scope.addElement = function() {
                $scope.trans.push(null);
                var key = $scope.trans.length-1;
                $scope.editor[key] = true;
                focus("tangular" + key, true);
            }
            $scope.removeElement = function(key) {
                logger.warn("Removing "+ key);
                $scope.trans.splice(key, 1);
                update();
            }
            $scope.editElement = function(key) {
                $scope.editor[key] = true;
                focus("tangular" + key, true);
            }
            $scope.saveElement = function(key) {
                logger.info("Saving from key "+key);
                $scope.editor[key] = false;
                update();
            }
            $scope.closeModal = function() {
                $modalInstance.close();
            }
        }
      }); // END UPLOAD CONTROLLER
    };

//DEBUG //DEBUG
//$scope.openModal("809f6c25-4db1-4632-b52c-6767e6117984");
//DEBUG //DEBUG

}) //end SubmissionController

//////////////////////////////////////////////////////////////
.controller('StepController', function ($scope, $stateParams)
{
    $scope.setStep($stateParams.stepId);
})

//////////////////////////////////////////////////////////////
.controller('StepDirectiveController', function (
    $rootScope, $filter,
    $scope, $timeout, directiveTimeout, NotificationData, AppConfig,
    StepTemplate, StepContent)
{

    ////////////////////////////////////////////////
    // Build objects
    $scope.data = [];
    $scope.contentData = StepContent.build($scope.identifier, $scope.step);

    var getType = function(key) {
        // save type to be sure in the future?
        var type = $scope.types[0].text;
        if ($scope.types[key])
            type = $scope.types[key].text;
        return type;
    }

    ////////////////////////////////////////////////
    // Procedure to mix data and save it into scope
    var injectData = function(template, content)
    {
        // var init
        var index = 0;
        var count = 0;
        var data = [];

        //console.log(content);
        if (content.values && content.values.length && content.id)
            $scope.contentData.setId(content.id);

        // Mixing template and content here
        angular.forEach(template, function(obj, pos) {
            var value = null;
            var key = -1;
            var type = getType(obj.value);
            index++;
            // IF I HAVE DATA
            if (content.values) {
                //console.log("I have template", obj, pos);
                var key = content.hashes.indexOf(obj.hash);
                //console.log("step", pos, "key", key, "values", content);
                value = content.values[key];
                if (type == 'number')
                    value = parseInt(value);
                //console.log("key", pos, "obj", type);
            }
            if (value && value !== '')
                count++;
            data[pos] = {
                key: obj.label, value: value, type: getType(obj.value),
                req: parseInt(obj.required), extra: obj.extra, hasher: obj.hash,
            };

        });

// TO FIX - how? save this data inside object?
//probably yes
        $scope.data[$scope.step] = data;
        $scope.countTempl = index;
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
    $scope.checkData = function(required, data, type) {
        if (!data && required) {
          return "Questo campo è obligatorio";
        } else if (type == 'string') {
          return true;
        } else if (type == 'number') {
          return true;
        } else if (type == 'email') {
//does not verify if you have the dot after @
          return true;
        } else if (type == 'date') {
          return true;
        } else if (type == 'time') {
          return true;
        } else if (type == 'color') {
          return true;
        } else if (type == 'url') {
//only checks for http protocol. I think there should be at least one dot
          return true;
        }
        // Validation
        //console.log("Check data", data);
        // Unknown type. Problem in configuration.
        return "La tipologia '"+type+"' non e' ancora implementata";
    }

    // Save button
    $scope.saveStep = function() {

        // Signal that we are going to try to edit data
        NotificationData.setNotification(AppConfig.messageStatus.loading);

        // Try to save data. Also this has to be a promise
        // if i want to handle notification at this level
        $scope.contentData.setData(
            $scope.data[$scope.current], $rootScope.user.myid, $scope.identifier)
         .then(function(success) {
            if (success) {

              $timeout( function() {
                  NotificationData.setNotification( AppConfig.messageStatus.success,
                    "Salvataggio riuscito");
              }, 800);
            } else {
// CHECK ME AGAIN
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