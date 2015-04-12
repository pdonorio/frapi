'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController',
    function ($scope, $state, $stateParams, user)
{

    // First check
    if (user.isLogged()) {
        console.log("Yes");
        $state.go("logged.main");
    }

    // INIT
    $scope.gostate = $state.go;
    $scope.user = null;
    $scope.registered = true;
    $scope.welcome = false;

    // DECIDE ROUTE
    if ($stateParams.status == 'register') {
        $scope.registered = false;
    } else if ($stateParams.status == 'registered') {
        $scope.registered = true;
        $scope.welcome = true;
    }

    $scope.register = function(user) {
        if($scope.registerForm.$valid){

// TO FIX - CHECK EMAIL format?

// TO FIX - Check already existing?
          console.log("FIX REGISTER");
/*
          var ldap = new Account(user);
          ldap.set().then(function(id){
             // IF?
              $state.go('unlogged.dologin', {status: 'registered'});
          });
*/
        } else {
          console.log("NOT Valid");
        }
    };

    // Clear form
    $scope.reset = function() {
        $scope.user = {};
    };
    $scope.reset();

    $scope.login = function(data) {
        // Sanitize 'data' ?
// TO FIX

        // Try
        user.set(data);
        user.logIn().then(function(response) {
            if (response) {
                $scope.loginError = null;
                console.log("Logged");
// TO FIX
                //$state.go('logged.main');
            } else {
                $scope.loginError = user.getError();
            }

        });
    }

});