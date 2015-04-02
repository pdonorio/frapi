'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope, $cookies, $state, $stateParams, Account)
{
    $scope.gostate = $state.go;
    $scope.registered = true;
    $scope.welcome = false;
    $scope.user = null;
    //console.log("Pars", $stateParams);

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

          var ldap = Account.build(user);
          ldap.set().then(function(id){
              $state.go('dologin', {status: 'registered'});
          });
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

    $scope.login = function(user) {
        var ldap = Account.build(user);
        ldap.check().then(function(response){
            if (response === true) {
// TO FIX - save token in session

              // log me in
              $state.go('logged.main');
            } else {
              $scope.loginError = response;
              console.log("Failed login");
            }
        });
    }

});