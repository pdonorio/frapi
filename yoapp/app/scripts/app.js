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
    'uiSwitch',     //osx like switcher
  // DEPENCIES: own filters
    'textOperations', //my filters on strings
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

/************************************************/
/************************************************/
  // FOR TESTING NOTIFICATION PURPOSE :)
  .controller('SomeController', ['$rootScope', '$scope','NotificationData',
    function($rootScope, $scope, NotificationData){

      $rootScope.$emit('rootScope:emit', 'gbgoff');
      $rootScope.$emit('rootScope:emit', 'fooon');

      $scope.setNotification = function(s,m) {
        //console.log("Some controller: set notifaction with "+s+","+m);
        NotificationData.setNotification(s,m);
      };
  }])
/************************************************/
/************************************************/

//ROUTING new
//myApp
.config(function($stateProvider, $urlRouterProvider) {

  // The usual code to catch any url but instead of a string ("/ntofound") we use a function
  // which receives $injector and $location.
  // We could check which URL the user wanted using $location but in this case we are going
  // to simply send them to the error state.
  // We then tell the provider that we handled the request.

  $urlRouterProvider.otherwise(function ($injector, $location) {
    $injector.invoke(['$state', function ($state) {
      $state.go('notfound');
    }]);
    return true;
  });
  //Alias for no url?
  $urlRouterProvider.when('', '/static');
/*
  // For any unmatched url, redirect to
  $urlRouterProvider.otherwise("/static");
*/

  // Set up the states
  $stateProvider

    .state('notfound', {
      url: "/404",
      views: { "main": { templateUrl: "views/oops.html", }, },
      onEnter: function($rootScope){
        $rootScope.$emit('rootScope:emit', 'padoff');
      },
    })
    .state('welcome', {
      url: "/static",
      views: { "main": { templateUrl: "views/welcome.html", }, },
      onEnter: function($rootScope){
        $rootScope.$emit('rootScope:emit', 'padoff');
      },
    })
    .state('dologin', {
      url: "/login",
      views: { "main": { templateUrl: "views/login.html", }, },
    })

    //LOGGED MAIN SKELETON (parent view)
    .state('logged', {
      url: "/app",
      views: {
        "main": { templateUrl: "views/app.html", },
        //reminder: this line below will not work as the 'contain' view is nested!
        //"contain": { templateUrl: "views/main.html", },
      },
    })
    // LOGGED Child routes (sub view, nested inside parent)
      .state('logged.home', {
        url: "/home",
        views: { "contain": { templateUrl: "views/main.html", }, },
      })
      .state('logged.submission', {
        url: "/add",
        views: { "contain": {
          templateUrl: "views/submit.html",
          controller: 'SubmissionController',
        }, },
      })
    ;

});

/*
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

*/

