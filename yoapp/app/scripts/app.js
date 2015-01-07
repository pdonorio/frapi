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
  // DEPENCIES: base yeoman modules
    'ngAnimate', 'ngCookies',
    'ngRoute', 'ngSanitize', 'ngTouch',
  // DEPENCIES: external modules
    'restangular',
    'xeditable',
    'uiSwitch',
  // DEPENCIES: own filters
    'textOperations',
  ])
  // CONSTANTS
  .constant('apiaddress', 'http://awesome.dev:5507')
  .constant('perpageDefault', 10)
  .constant('currentpageDefault', 1)
  //ROUTING
  .config(function ($routeProvider) {

//Note to self: the controller that has access to the whole page is
  //'MainController'

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .when('/search', {
        templateUrl: 'views/datatable.html',
        controller: 'ViewController',
        //factory: 'DataResource' //?? it works without...
      })
      .otherwise({
        redirectTo: '/'
      });
  });
