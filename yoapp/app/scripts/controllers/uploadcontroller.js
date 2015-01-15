'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:UploadcontrollerCtrl
 * @description
 * # UploadcontrollerCtrl
 * Controller of the yoApp
 */
myApp
  .controller('UploadController', function ($scope, FileUploader)
{

    $scope.test = [ 'AngularJS', 'Karma' ];

    //Init uploader
    $scope.uploader = new FileUploader();

});
