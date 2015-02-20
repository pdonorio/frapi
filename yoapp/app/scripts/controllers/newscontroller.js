'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:NewsController
 * @description
 * # NewsController
 * Controller of the yoApp
 */
myApp
.controller('NewsController', function($rootScope, $scope, NotificationData, API,
  $modal, $log)
{

  /////////////////////////////////
  // Modal
  $scope.open = function (size) {
    // get instance
    var modalInstance = $modal.open({
      templateUrl: 'templates/modal.html',
      backdrop: true,
    });
    //after closing
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  /////////////////////////////////
  $scope.setNotification = function(s,m) {
    NotificationData.setNotification(s,m);
  };

  $scope.news = [];

  // Angular query api
  API.get("news")    // Use the data promise
    .then(function(data) {  //Success
        //console.log(data);

        //do modifications to $scope
        for (var i = 0; i < data.items.length; i++) {
          var x = data.items[i];
          //console.log(x);

          // Fix date and push
          var tmp = new Date(x.date);
          x.date = tmp;
          $scope.news.push(x);
        };

        //$scope.news = data.items;

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
    //HANDLE Datetime...
    //return $http.post('/saveUser', data);
  };
  // remove
  $scope.removeNews = function(index) {
    $scope.news.splice(index, 1);
    //API remove
  };
  // add
  $scope.addNews = function() {
    var newDate = new Date("January 1 2015 00:00:00 +0000");
    $scope.inserted = {
      id: null, //$scope.news.length+1,
      date: newDate,
      description: 'Ultima',
      user: 'paulie',
    };
    $scope.news.push($scope.inserted);
    //API add
  };

});