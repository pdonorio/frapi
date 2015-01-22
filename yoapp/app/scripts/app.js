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
  .constant('apiTimeout', 15750) //remember: a refused connection waits no time
  .constant('messageTimeout', 3000)
  .constant('warningInitTime', 7500)
  .constant('perpageDefault', 7)
  .constant('currentpageDefault', 1)
  .constant('someInitTime', 1500)

  //BOOTSTRAP TOOLTIP/POPOVER
  //http://www.bootply.com/cskelly/H4Zii7Mb6l
  .directive('toggle', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        if (attrs.toggle=="tooltip"){
          $(element).tooltip();
        }
        if (attrs.toggle=="popover"){
          $(element).popover();
        }
      }
    };
  })

  // FOR TESTING NOTIFICATION PURPOSE :)
  .controller('SomeController', ['$scope','NotificationData',
    function($scope, NotificationData){
      $scope.setNotification = function(s,m) {
        //console.log("Some controller: set notifaction with "+s+","+m);
        NotificationData.setNotification(s,m);
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
      .when('/notfound', {
        templateUrl: 'views/oops.html',
      })
      .when('/submit', {
        templateUrl: 'views/submit.html',
        controller: 'SubmissionController',
      })
      .when('/view/:viewid', {
        templateUrl: 'views/viewer.html',
        controller: 'ViewerController',
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
        redirectTo: '/notfound'
      });
  })
  ;

