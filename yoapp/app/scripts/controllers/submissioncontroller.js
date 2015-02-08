'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:SubmissionController
 * @description
 * # SubmissionController
 * Controller of the yoApp
 */
myApp
.controller('SubmissionController', function ($rootScope, $scope, $state, $stateParams, $filter, DataResource, NotificationData, AppConfig)
{
    ////////////////////////////////
    // get variable inside url as param
    var id = $stateParams.myId;
    // Inject for DOM
    $scope.id = id;

    ////////////////////////////////
    // STEPS EDITABLE

    // Init
    $scope.steps = [];
    $scope.stepsCopy = [];

    // Manage switch to enable edit form (for ADMIN)
    $scope.$on('switch', function(event, enabled) {
        // Copy data when enabling changes
        if (enabled) {
            $scope.stepsCopy = angular.copy($scope.steps);
            // Show the form for changes
            $scope.stepsForm.$show();
        } else {
            // Close the form for changes
            $scope.stepsForm.$hide();
        }
    });
    // closing actions
    var closingAction = function() {
        $state.go('logged.submission');
        return true;
    }
    // undo
    $scope.undoSteps = function() {
        // Recover the array copied
        $scope.steps = angular.copy($scope.stepsCopy);
        // Abort the current form
        $scope.stepsForm.$cancel();
        return closingAction();
    };
    // save
    $scope.saveSteps = function() {

        // Note to self: remeber to strip away that $$hashKey (with angular: copy or toJson)
        var o1 = angular.toJson($scope.steps, true);
        //console.log(o1);
        // This was my previous copy
        var o2 = angular.toJson($scope.stepsCopy, true);
        //console.log(o2);

        // Did anything change?
        if (angular.equals(o1,o2))
            return closingAction(); //if not

// TO FIX -
        // Check api online and db working
        //DataResource.get("verify").then(function() {}

        console.log("Something is changed");

        /*  ******************************************
         *  For each new step
         *      find the old with same step number
         *          YES
         *              if changed save it
         *               remove from old step that position
         *          NO
         *              add / save
         *  For each remaining old step
         *      delete from api
        /*  ******************************************/
/*
        for (var j = 0; j < $scope.steps.length; j++) {

            var neww = $scope.steps[j];
            var current = neww.step;
            var tmp = $filter('filter')($scope.stepsCopy, {step: current});
            console.log("step " + current + " - Found");
            console.log(tmp);

            var oldd = null;
            if ($scope.stepsCopy[j]) {
                oldd = $scope.stepsCopy[j];
                //console.log(oldd);
            }

/*
            if (!angular.equals(neww, oldd)) {
                console.log("Should save step ", j);
                console.log(neww);
                console.log(oldd);
                console.log("Uhm");
            }

/*
            //API CALL
            DataResource.set("steps", data).then(function() {
                msg = "Saved content<br> <div class='well'>"+ $scope.item.content +"</div>";
                NotificationData.setNotification(AppConfig.messageStatus.success, msg);
            }, function() {
                msg = "Could not save steps editing<br> " +
                "<br> <br> Please try again in a few minutes." + "";
                NotificationData.setNotification(AppConfig.messageStatus.error, msg);
            });
*/

        //};

        // Note to self:
        // i should reload the view which shows the step contents!
        $state.go('logged.submission');
    }
    // remove
    $scope.removeStep = function(index) {
        $scope.steps.splice(index, 1);
    };
    // add
    $scope.addStep = function() {
        var newStep = {
          id: null,
          step: $scope.steps.length + 1,
          label: 'nuovo',
        };
        $scope.steps.push(newStep);
    };

// TO FIX - should get the step from url/routing
    //First step
    $scope.current = 1;
    //define step on click
    $scope.setStep = function(step) {
        //console.log("Entering step ", step);
        $scope.$broadcast('formActivation', false);
        $scope.current = step;
    }

    ////////////// READ STEP CONTENT / TYPE
    // Missing for now?
    // Should also build template based on type per each step....

    //////////////////////////////////////////////
    // STEP template
    $scope.formTemplate = [
        {pos:1, key: "titolo", type: "number"},
        {pos:2, key: "pippo", type: "select"},
        {pos:3, key: "ancora", type: "text"},
        {pos:4, key: "ultimo", type: "textarea"},
    ];

    // INIT EACH STEP
    $scope.bootData = [];
    $scope.stepNames = [];

    function fillStepData() {

        for (var x = 0; x < $scope.steps.length; x++)
        {
            var step = $scope.steps[x];
            //fix data based on template
            //should be different for each step
            var template = $scope.formTemplate;

            //otherwise ng-repeat filters DO NOT WORK:
            var results = [];   //ARRAY and NOT JSON!!!!!

            //foreach template, get data and create new element in scope
            for (var j = 0; j < template.length; j++)
            {
                //get the position
                var tmp = template[j];
                var i = tmp.pos;

                //find existing data in that position
                var data = $filter('filter')(step.form, {pos: i});
                tmp.value = null;

                //if exists
                if (data && data.length > 0 && data[0].key == tmp.key) {
                    //mix template with existing data inside results
                    tmp.value = data[0].value;
                }
                //save results with key pos orderable
                results[j] = angular.copy(tmp);
            };

            //save step x
            $scope.bootData[x] = angular.copy(results);
            $scope.stepNames[x] = step.name;
        }
        //console.log($scope.bootData);
        //console.log($scope.stepNames);

    }

    //////////////////////////////////////////////
    // SETUP data - read from API
    DataResource.get("steps")    // Use the data promise
     .then(function(data) {  //Success
        for (var i = 0; i < data.count; i++) {
            var x = data.items[i];
            var tmp = { step: x.step, name: x.label, form: null};
            // Check on template and type?
            if ($scope.id == 'new') {
                //console.log("New");
            } else {
                tmp.form = [
                    {pos:1, key: "titolo", value: 3},
                    {pos:4, key: "ultimo", value: "test"},
                    {pos:3, key: "ancora", value: "<i>html</i>"},
                    {pos:2, key: "pippo", value: "se moi"},
                ];
            }
            //do modifications to $scope
            $scope.steps.push(tmp);
        };

        // Use the data since it is finally available
        fillStepData();

        // If working on empty step as first, show already the form
        if ($scope.id == 'new') {
            // Send the same event to every child controller/scope listening
            $scope.$broadcast('formActivation', true);
        }

     }, function(object) {      //Error
      console.log("Controller api 'steps' call Error");
      console.log(object);
     }
    );

 });