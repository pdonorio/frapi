'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # yoApp
 *
 * Main module of the application.
 */
var myModule = angular
  .module('yoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular',
  ])
  // CONSTANTS
  .constant("apiaddress", 'http://awesome.dev:5507')
  .constant("perpage_default", 10)
  .constant("currentpage_default", 1)

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
