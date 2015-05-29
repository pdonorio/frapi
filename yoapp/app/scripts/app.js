'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # yoApp
 *
 * Main module of the application.
 */
var myApp = angular.module('archivi',
  [
  // CONFIGURATION and DYNAMIC CONSTANTS - made by me
    'AppConfig',
  // LOGGER
    'ny.logger',
  // DEPENCIES: base yeoman modules
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
  // DEPENCIES: external modules
    'ui.router',      //some serious and nested views (instead of ngRoute)
    'ui.bootstrap',   //https://github.com/angular-ui/bootstrap
    'restangular',  //api calls from js
    'xeditable',    //make html content editable with click/switch
    'angularFileUpload',  //uploader for files
    'textAngular', //html editor inside transcriptions inline
  // DEPENCIES: own filters
    'textOperations', //my filters on strings
    'arrayOperations', //my filters on arrays
  ])

/*
// FIX template caching...
//http://opensourcesoftwareandme.blogspot.it/2014/02/safely-prevent-template-caching-in-angularjs.html
.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
})
*/

// LOGGER
.config(['LoggerProvider', function(LoggerProvider) {
    // We don't want the Logger service to be enabled in production
    LoggerProvider.enabled(true);
}])

// THIS IS NEEDED FOR DEVELOPMENT
// allow insecure https if your host does not have an official certificate yet
//see: https://docs.angularjs.org/api/ng/provider/$sceDelegateProvider
.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        //'http://srv*.assets.example.com/**'
    ])
})

  // CONSTANTS
  .constant('projectName', 'SpectaleBaroque')
  //.constant('devHost', 'awesome.dev')
  .constant('devHost', 'dev.pile.wf')
  // USERS
  .constant('COOKIEVAR_AUTHTOKEN', 'mysecrettoken')
  .constant('COOKIEVAR_USER', 'mysecretuser')
  .constant('FAILED_TOKEN', 'epicfailwithsecret')
  .constant('FAILED_USER', 'epicfailwithuser')
  // Other
  .constant('apiTimeout', 15750) //remember: a refused connection waits no time
  .constant('messageTimeout', 3000)
  .constant('warningInitTime', 7500)
  .constant('perpageDefault', 7)
  .constant('currentpageDefault', 1)
  // use more time to load the page
  .constant('someInitTime', 1000)

/////////////////////////////////////////
// How to force reload (controller init) with ui router
// http://stackoverflow.com/a/23198743/2114395
.config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
})

/////////////////////////////////////////
// HOW TO GET FOCUS - this can be used from any controller
// http://stackoverflow.com/a/18295416
.directive('focusOn', function(textAngularManager) {

   return function(scope, elem, attrs) {
      scope.$on('focusOn', function(e, name, tangular) {

        /////////////////////
        // Fix the focus for textAngular editor
        if (tangular) {
            // Retrieve the scope and trigger focus
            var editorScope = textAngularManager.retrieveEditor(name).scope;
            //console.log("Get", name);
            editorScope.displayElements.text[0].focus();
        /////////////////////
        } else {
            // Normal mode
            if(name === attrs.focusOn) {
              //console.log("TEST", elem, elem[0].focus);
              elem[0].focus();
            }
        }
        /////////////////////
      });
   };
})

.factory('focus', function ($rootScope, $timeout) {
  return function(name, tangular) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name, tangular);
    }, 150);
  }
})

/////////////////////////////////////////
// FOR TESTING PURPOSE ONLY
.controller('SomeController', function($scope)
{
  $scope.test = 1;
})
;