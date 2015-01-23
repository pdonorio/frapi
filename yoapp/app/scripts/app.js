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
    'ui.bootstrap',   //https://github.com/angular-ui/bootstrap
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
  .controller('SomeController', ['$rootScope', '$scope','NotificationData',
    function($rootScope, $scope, NotificationData){

      $rootScope.$emit('rootScope:emit', 'gbgoff');
      $rootScope.$emit('rootScope:emit', 'fooon');

      $scope.setNotification = function(s,m) {
        //console.log("Some controller: set notifaction with "+s+","+m);
        NotificationData.setNotification(s,m);

      };

      $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];



  }])

  //ROUTING
  .config(function ($routeProvider, $locationProvider) {
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

      // enable html5Mode for pushstate ('#'-less URLs)
      //$locationProvider.html5Mode(true);
  })
  ;
