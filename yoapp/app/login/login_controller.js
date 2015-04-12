'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController',
    function ($scope, $state, $stateParams, user)
{

// TO FIX
    console.log("LOGIN: Already logged? (tofix)", user);
    user.isLogged();
/*
    // First check
    var model = new Account();
    model.check().then(function(response){
        if (response === true) {
            console.log("Yes");
            $state.go("logged.main");
        }
    });
*/

    // INIT
    $scope.gostate = $state.go;
    $scope.registered = true;
    $scope.welcome = false;
    $scope.user = null;

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

    $scope.login = function(user) {

        console.log("FIX LOGIN");

/*
        var model = new Account(user);

        model.check().then(function(response){

console.log("I AM HERE", response);

            var token = null;
            if (response === true) {
// TO FIX - GET A REAL TOKEN!
                token = 'qualcosa';
            } else {
              $scope.loginError = response;
              console.log("Failed login");
            }

            console.log("Ready to check auth");
// // TO FIX - set with user model
//             // Save what i get
//             Auth.set(token, user.email);
//             // Check if working
//             if (Auth.checkAuth())
//                 $state.go('logged.main');
        });
*/
    }

});