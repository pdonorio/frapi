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
    'angularFileUpload',  //uploader for files
    'uiSwitch',     //osx like switcher
  // DEPENCIES: own filters
    'textOperations', //my filters
  ])

  // CONSTANTS
  .constant('apiTimeout', 1250)
  .constant('messageTimeout', 4000)
  .constant('perpageDefault', 7)
  .constant('currentpageDefault', 1)

  .controller('SomeController', ['$scope','NotificationData',
    function($scope, NotificationData){

      $scope.setNotification = function(s,m) {
        console.log("Some controller: set notifaction with "+s+","+m);
        NotificationData.setNotification(s,m);
        NotificationData.setNotificationStatus(s);
      };

  }])

  //ROUTING
  .config(function ($routeProvider) {
    //Note to self: the controller that has access to the whole page is
    //'MainController'
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        //using main controller here
      })
      .when('/submit', {
        templateUrl: 'views/submit.html',
        controller: 'SubmissionController',
      })
      .when('/search', {
        templateUrl: 'views/datatable.html',
        controller: 'ViewController',
        factory: 'DataResource'
      })
      .when('/change', {
        templateUrl: 'views/change.html',
        controller: 'SomeController',
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  ;

