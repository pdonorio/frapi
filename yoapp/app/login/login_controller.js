'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope, $state, $stateParams)
{
    $scope.gostate = $state.go;
    $scope.registered = false;
    if ($stateParams.status == 'register') {
        $scope.registered = true;
    }
    $scope.user = null;
    $scope.master = {};

    $scope.register = function(user) {
        if($scope.registerForm.$valid){
    //CHECK EMAIL?

            console.log("Valid");
            $scope.master = angular.copy(user);
        } else {
            console.log("NOT Valid");
        }
    };

    // go to login.main

    // Clear form
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();

});