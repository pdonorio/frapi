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
  // DEPENCIES: base yeoman modules
    'ngAnimate',
    //'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
  // DEPENCIES: external modules
    'ui.router',      //some serious and nested views (instead of ngRoute)
    'ui.bootstrap',   //https://github.com/angular-ui/bootstrap
    'restangular',  //api calls from js
    'xeditable',    //make html content editable with click/switch
    'angularFileUpload',  //uploader for files
  // DEPENCIES: own filters
    'textOperations', //my filters on strings
    'arrayOperations', //my filters on arrays
  ])

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
  // Other
  .constant('apiTimeout', 15750) //remember: a refused connection waits no time
  .constant('messageTimeout', 3000)
  .constant('warningInitTime', 7500)
  .constant('perpageDefault', 7)
  .constant('currentpageDefault', 1)
  // use more time to load the page
  .constant('someInitTime', 1000)


/////////////////////////////////////////
// FOR TESTING PURPOSE ONLY
.controller('SomeController', function($scope)
{
  $scope.test = 1;
})
;