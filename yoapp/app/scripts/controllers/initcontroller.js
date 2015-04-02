'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp
.controller('InitController', function($scope, $state, $rootScope, $location, devHost)
{

    // If redirection goes wrong
    $rootScope.$on('$stateChangeError', function(event) {
      $state.go('notfound');
    });

    // Personal css to include
    $rootScope.css = [
        "styles/main.css",
        "styles/topbar.css",
        "styles/blur.css",
    ];
    var cssFont = 'http://fonts.googleapis.com/css?family=Mr+De+Haviland';

    // Google analytics only if on production site
    $rootScope.analytics = false;
    // Development should not be studied with analytics
    if ($location.host() != devHost) {
        $rootScope.analytics = true;
        $rootScope.css.push(cssFont);
    }
    //console.log("Analytics? " + $rootScope.analytics);

    // Today, for any scope of my app
    $rootScope.date = new Date();

    //////////////////////////////////////
    // editable element via xeditable: init?
    $rootScope.edit = {
// TO FIX -
        available: true, //ONLY IF ADMIN!!
        switch: false,
        state: 1
    };
    $rootScope.switchEdit = function(state) {
        $rootScope.edit.switch = state;
        // Send the same switched event to every child controller/scope listening
        $scope.$broadcast('switch', state);
        if (state) {
            $rootScope.$emit('rootScope:emit', 'dbgon');
        } else {
            $rootScope.$emit('rootScope:emit', 'dbgoff');
        }
    };

    /*  ******************************************
        *** BROADCAST of messages across the application
        ******************************************/

    //from broadcasts of views
    $scope.onOff= {
        // Use pad when there is a topbar, otherwise a big image as background
        pad : false,
        // Handle grey background
        bg : false,
        // Dark background for edit mode
        dark : false,
    };
    $rootScope.$on('rootScope:emit', function (event, data) {
        //console.log(data);
        if (data == "gbgon") {
            $scope.onOff.bg = true;
        } else if (data == "gbgoff") {
            $scope.onOff.bg = false;
        } else if (data == "padoff") {
            $scope.onOff.pad = false;
        } else if (data == "padon") {
            $scope.onOff.pad = true;
        } else if (data == "dbgon") {
            $scope.onOff.dark = true;
        } else if (data == "dbgoff") {
            $scope.onOff.dark = false;
        // Remove edit button on topbar?
        } else if (data == "editon") {
            $rootScope.edit.available = true;
        } else if (data == "editoff") {
            $rootScope.edit.available = false;
        } else {
            console.log("Unknown broadcast: " + data);
        }
    });

});