'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # yoApp
 *
 * Main module of the application.
 */
var myModule = angular.module('yoApp',
  [
    'ngAnimate', 'ngCookies',
    //'ngResource',
    'restangular',
    'ngRoute',
    'ngSanitize', 'ngTouch',
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
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/search', {
        templateUrl: 'views/datatable.html',
        controller: 'ViewCtrl',
        factory: 'DataResource'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
