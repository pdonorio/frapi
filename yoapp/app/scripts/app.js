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
  // CONFIGURATION and DYNAMIC CONSTANTS
    'AppConfig',
  // DEPENCIES: base yeoman modules
    'ngAnimate', 'ngCookies',
    'ngRoute', 'ngSanitize', 'ngTouch',
  // DEPENCIES: external modules
    'restangular',  //api calls from js
    'xeditable',    //make html content editable with click/switch
    'uiSwitch',     //osx like switcher
  // DEPENCIES: own filters
    'textOperations', //my filters
  ])

  // CONSTANTS
  .constant('apiTimeout', 1250)
  .constant('messageTimeout', 4000)
  .constant('perpageDefault', 10)
  .constant('currentpageDefault', 1)
  //ROUTING
  .config(function ($routeProvider) {

//Note to self: the controller that has access to the whole page is
  //'MainController'

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        //using main controller here
        directive: 'directives/editablecontent.js',
      })
      .when('/submit', {
        templateUrl: 'views/submit.html',
        controller: 'SubmissionController'
      })
      .when('/search', {
        templateUrl: 'views/datatable.html',
        controller: 'ViewController',
        factory: 'DataResource'
      })
      .when('/change', {
        templateUrl: 'views/change.html',
        //controller: 'AboutController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
