'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoApp
 */
myModule
  .controller('ViewCtrl', function ($scope,
    DataResource, perpage_default, currentpage_default)
{
    // Init: Html scope data
    $scope.datacount = 0;
    $scope.from = 0;
    $scope.data = {};
    $scope.headers = [ "", "Key", "Value" ];
    $scope.perpage = perpage_default;
    $scope.currentpage = currentpage_default;

    //Bind data in html to function
    $scope.reloadTable = function(perpage, currentpage)
    {

      //Warning: if data is coming from input
      //we must convert string to integer (just in case)
      perpage = parseInt(perpage);
      if (isNaN(perpage)) {
        perpage = perpage_default;
      }
      currentpage = parseInt(currentpage);
      if (isNaN(currentpage)) {
        currentpage = currentpage_default;
      }
      //console.log(perpage);

      // Get the data (as a promise)
      promise = DataResource.get("data", perpage, currentpage);

      // Use the data promise
      promise
        //Success
        .then(function(data) {

          //assign data to scope
          $scope.datacount = data.count;
          $scope.data = data.items;
          from = (perpage * (currentpage-1)) +1;
          if (from < 1) { from = 1; }
          $scope.from = from;
        },
        //Error
        function(object) {
          console.log("Controller api call Error");
          console.log(object);
        }
      );

    }

    // First time call to get data - with defaults
    $scope.reloadTable();
    /* HOW TO CACHE ?? */

});
