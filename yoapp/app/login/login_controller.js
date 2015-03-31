'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope, $state, $stateParams, Account)
{
    $scope.gostate = $state.go;
    $scope.registered = false;
    if ($stateParams.status == 'register') {
        $scope.registered = true;
    }
    $scope.user = null;

    $scope.register = function(user) {
        if($scope.registerForm.$valid){
    //CHECK EMAIL?
          console.log("Valid");
          var ldap = Account.build(user);

        // go to login.main ??
        } else {
          console.log("NOT Valid");
        }
    };


    // Clear form
    $scope.reset = function() {
        $scope.user = {};
    };
    $scope.reset();

});