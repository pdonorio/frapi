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

    //$scope.test = [ 'AngularJS', 'Karma' ];

    //Init uploader
    $scope.uploader = new FileUploader();
    //Set upload path
    $scope.uploader.url =
        //"http://awesome.dev:5555/tmp"
        "http://awesome.dev:5346/uploads"
        ;

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
    // $scope.uploader.onSuccessItem = function(item, response, status, headers) {
    //     console.log("Success!");
    // }

});
