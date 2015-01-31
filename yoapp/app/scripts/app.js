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
  .constant('projectName', 'SpectaleBaroque')
  .constant('apiTimeout', 15750) //remember: a refused connection waits no time
  .constant('messageTimeout', 3000)
  .constant('warningInitTime', 7500)
  .constant('perpageDefault', 7)
  .constant('currentpageDefault', 1)
  .constant('someInitTime', 1500)

//TO FIX
  //TO REMOVE with ui bootstrap //BOOTSTRAP TOOLTIP/POPOVER
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
  // FOR TESTING NOTIFICATION PURPOSE :)
  .controller('SomeController', ['$rootScope', '$scope','NotificationData',
    function($rootScope, $scope, NotificationData){

      $scope.setNotification = function(s,m) {
        //console.log("Some controller: set notifaction with "+s+","+m);
        NotificationData.setNotification(s,m);
      };

      //console.log("Testing controller");
  }])
/************************************************/
