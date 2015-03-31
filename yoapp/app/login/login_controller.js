'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController', function ($scope, $state, $stateParams, Account)
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
    //CHECK EMAIL?
          console.log("Valid");
          var ldap = Account.build(user);
          ldap.set().then(function(id){

// TO FIX - how to set another parameter to give to angularroute
            $state.go('dologin', {status: 'registered', id: id});
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

});