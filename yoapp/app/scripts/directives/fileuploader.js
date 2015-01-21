'use strict';

/**
 * @ngdoc directive
 * @name yoApp.directive:FileUploader
 * @description
 * # FileUploader
 */
myApp
.directive('fileUploader', function () {
 return {
  //create my div for uploading multiple files
  restrict: 'E',
  //create a template to work data inside the markup
  templateUrl: 'templates/uploader.html',
  controller: 'UploadController',
/*
  link: function postLink(scope, element, attrs) {
    element.text('this is the FileUploader directive');
  }
*/

 };
});
