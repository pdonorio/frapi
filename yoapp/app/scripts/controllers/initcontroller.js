'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp
.controller('InitController', function($scope, $rootScope, $location, devHost)
{

    // If redirection goes wrong
    $rootScope.$on('$stateChangeError', function(event) {
      $state.go('notfound');
    });

    // Google analytics only if on production site
    $rootScope.analytics = false;
    // Development should not be studied with analytics
    if ($location.host() != devHost) {
        $rootScope.analytics = true;
    }
    //console.log("Analytics? " + $rootScope.analytics);

    /*  ******************************************
        *** BROADCAST of messages across the application
        ******************************************/

    //from broadcasts of views
    $scope.onOff= {
        // Use pad when there is a topbar, otherwise a big image as background
        pad : false,
        // Handle grey background
        bg : false,
        // Footer on off
        footer : true,
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
        } else if (data == "fooon") {
            $scope.onOff.footer = true;
        } else if (data == "foooff") {
            $scope.onOff.footer = false;
        } else {
            console.log("Unknown broadcast: " + data);
        }
    });

});