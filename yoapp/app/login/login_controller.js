'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController',
    function ($scope, $state, $stateParams,
        Logger, user
        //Account, cookie
        )
{
    var logger = Logger.getInstance('LoginCTRL');

    // First check
    if (user.isLogged()) {
        console.log("Yes!!!");
        //$state.go("logged.main");
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

    $scope.register = function(data) {

        if($scope.registerForm.$valid){
// TO FIX
    //- CHECK EMAIL format?
// TO FIX
    //- Check already existing?

          //Register with API
          user.set(data);
          user.register().then(function(id){
              $state.go('unlogged.dologin', {status: 'registered'});
          });
        } else {
          logger.warn("Form is NOT valid");
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
                logger.debug("Logged");
                $state.go('logged.main');
            } else {
                $scope.loginError = user.getError();
            }

        });
    }

});