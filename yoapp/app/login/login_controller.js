'use strict';

// List of controllers
myApp
//////////////////////////////////////////////////////////////
.controller('LogoutController', function ($scope, $state)
{
    // LOGOUT
    console.log("Requested logout");

// TO FIX - use User? or inside Resolve?
/*
    Auth.set();
    $state.go("welcome");
*/
})

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope, $state, $stateParams, Account)
{
    $scope.gostate = $state.go;
    $scope.registered = true;
    $scope.welcome = false;
    $scope.user = null;
    //console.log("Pars", $stateParams);

    // First check
    console.log("Already logged?")

// TO FIX - user model
/*
    if (Auth.checkAuth()) {
        //var $state = $injector.get("$state");
        $state.go("logged.main");
    }
*/

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

          var ldap = new Account(user);
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
        var ldap = new Account(user);
        ldap.check().then(function(response){
            var token = null;
            if (response === true) {
// TO FIX - GET A REAL TOKEN!
                token = 'qualcosa';
            } else {
              $scope.loginError = response;
              console.log("Failed login");
            }

// TO FIX - set with user model
/*
            // Save what i get
            Auth.set(token, user.email);
            // Check if working
            if (Auth.checkAuth())
                $state.go('logged.main');
*/
        });
    }

});