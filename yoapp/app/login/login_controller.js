'use strict';

// List of controllers
myApp

//////////////////////////////////////////////////////////////
.controller('LoginController',
    function ($scope, $state, $stateParams, Logger, focus, user)
{
    // Logging
    var logger = Logger.getInstance('LoginCTRL');
    // Focus on first input field
    focus('focusMe');

    // First check
    if (user.isLogged()) {
        logger.warn("Already logged");
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

        // Try
        user.set(data);
        // Force login to save cookie
        user.logIn(true).then(function(reference) {

            if (reference.isLogged()) {
                $scope.loginError = null;
                logger.debug("Logged");
                $state.go('logged.main');
            // Invalid
            } else {
                $scope.loginError = reference.getError();
            }
        });
    }

});