'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:UploadcontrollerCtrl
 * @description
 * # UploadcontrollerCtrl
 * Controller of the yoApp
 */
myApp
  .controller('UploadController', function ($scope, AppConfig, FileUploader)
{

    //$scope.test = [ 'AngularJS', 'Karma' ];

    //Init uploader
    $scope.uploader = new FileUploader();
    //Set upload path
    $scope.uploader.url = AppConfig.apiFileBase; ;

/*
    $scope.uploader.onProgressItem = function(item, progress) {
        console.log("progress");
        console.log(item);
        console.log(progress);
    }
*/

    $scope.uploader.onCompleteItem = function(item, response, status, headers) {
        console.log("Upload streaming completed");
        console.log(item);
    }

});
