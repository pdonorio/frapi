'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # yoApp
 *
 * Main module of the application.
 */
var myApp = angular.module('yoApp',
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

  // CONSTANTS
  .constant('projectName', 'SpectaleBaroque')
  .constant('devHost', 'awesome.dev')
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