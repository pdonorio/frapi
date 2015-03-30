'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope)
{
    console.log("Login");

    $scope.registered = true; //false;
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

    // Clear form
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();

});