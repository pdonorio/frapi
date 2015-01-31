'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ViewercontrollerCtrl
 * @description
 * # ViewercontrollerCtrl
 * Controller of the yoApp
 */
myApp
  .controller('ViewerController', function ($rootScope, $scope, $stateParams, DataResource) {

    $scope.data = {};
    var id = $stateParams.viewId;
    $scope.id = id;

    // Get the data (as a promise)
    var promise = DataResource.get("data/" + id);

    promise
        .then(function(data) { //Success

          if (data.count < 1) {
            console.log("Document not found " + id);
          } else if (data.count > 1) {
            console.log("DUPLICATES?? " + id);
          } else {
              $scope.data = data.items;
          }

        }, function(object) { //Error
          console.log("View call Error for id " + id);
        }
    );

});