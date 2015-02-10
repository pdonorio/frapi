'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ViewercontrollerCtrl
 * @description
 * # ViewercontrollerCtrl
 * Controller of the yoApp
 */
myApp
  .controller('ViewerController', function ($rootScope, $scope, $stateParams, API) {

    $scope.data = {};
    var id = $stateParams.myId;
    $scope.id = id;

    // Get the data (as a promise)
    var promise = API.get("data/" + id);

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