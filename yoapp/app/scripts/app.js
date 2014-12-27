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
  // DEPENCIES: own filters
    'textOperations',
  ])
  // CONSTANTS
  .constant('apiaddress', 'http://awesome.dev:5507')
  .constant('perpageDefault', 10)
  .constant('currentpageDefault', 1)
  //ROUTING
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .when('/search', {
        templateUrl: 'views/datatable.html',
        controller: 'ViewController',
        factory: 'DataResource'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
