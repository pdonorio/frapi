'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoApp
 */
myModule
  .controller('MainCtrl', function ($scope) {

    $scope.menu = [
        {'link':'', 'name':'home'},
        {'link':'', 'name':'search'},
        {'link':'', 'name':'about'},
    ];
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
