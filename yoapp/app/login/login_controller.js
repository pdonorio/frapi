'use strict';

// List of controllers
myApp
//////////////////////////////////////////////////////////////
.controller('LogoutController', function ($scope, Auth, $state)
{
    // LOGOUT
    console.log("Requested logout");
    Auth.set();
    $state.go("welcome");
})

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope, Auth, $state, $stateParams, Account)
{
    $scope.gostate = $state.go;
    $scope.registered = true;
    $scope.welcome = false;
    $scope.user = null;
    //console.log("Pars", $stateParams);

    // First check
    console.log("Already logged?")
    if (Auth.checkAuth()) {
        //var $state = $injector.get("$state");
        $state.go("logged.main");
    }

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
            var token = null;
            if (response === true) {
// TO FIX - save token in session
                token = 'qualcosa';
            } else {
              $scope.loginError = response;
              console.log("Failed login");
            }
            // Save what i get
            Auth.set(token);
            // Check if working
            if (Auth.checkAuth())
                $state.go('logged.main');
        });
    }

});