'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp
 .controller('SubMainController', [ '$rootScope', '$scope', function ($rootScope, $scope)
 {

  $rootScope.$emit('rootScope:emit', 'gbgoff');
  $rootScope.$emit('rootScope:emit', 'fooon');

 }]);

