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
  // DEPENCIES: own filters
    'textOperations', //my filters on strings
  ])

  // CONSTANTS
  .constant('projectName', 'SpectaleBaroque')
  .constant('devHost', 'awesome.dev')
  .constant('apiTimeout', 15750) //remember: a refused connection waits no time
  .constant('messageTimeout', 3000)
  .constant('warningInitTime', 7500)
  .constant('perpageDefault', 7)
  .constant('currentpageDefault', 1)
  .constant('someInitTime', 1500)

/////////////////////////////////////////
// FOR TESTING PURPOSE ONLY
.controller('SomeController', function($rootScope, $scope, NotificationData, DataResource)
{
    $scope.setNotification = function(s,m) {
      //console.log("Some controller: set notifaction with "+s+","+m);
      NotificationData.setNotification(s,m);
    };

    // Angular query api
    DataResource.get("news")    // Use the data promise
      .then(function(data) {  //Success
          //console.log(data);
          //do modifications to $scope
          $scope.news = data.items;
          $scope.newsNum = data.count;
      }, function(object) {      //Error
        console.log("Controller NEWS api call Error");
        console.log(object);
      }
    );

    ///////////////////////////////////////////
    ///////////////////////////////////////////
    // Manage news
    $scope.saveNews = function(data, id) {
      //$scope.user not updated yet
      angular.extend(data, {id: id});
      //API save
      //return $http.post('/saveUser', data);
    };
    // remove user
    $scope.removeNews = function(index) {
      $scope.news.splice(index, 1);
      //API remove
    };
    // add user
    $scope.addNews = function() {
      $scope.inserted = {
        id: null, //$scope.news.length+1,
        date: '',
        description: '',
        user: 'paulie',
      };
      $scope.news.push($scope.inserted);
      //API add
    };
    // Validate text
    $scope.checkName = function(data, id) {
      if (id === 2 && data !== 'awesome') {
        return "Username 2 should be `awesome`";
      }
    };
    ///////////////////////////////////////////

})
