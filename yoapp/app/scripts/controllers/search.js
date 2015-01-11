'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ViewController
 * @description
 * # ViewController
 * Controller of the yoApp
 */
myApp
  .controller('ViewController', function ($scope, DataResource, perpageDefault, currentpageDefault)
{
    // Init: Html scope data
    $scope.datacount = 0;
    $scope.from = 0;
    $scope.data = {};
    $scope.headers = [ "#", "Key", "Value" ];
    $scope.perpage = perpageDefault;
    $scope.currentpage = currentpageDefault;


    $scope.fuzzy= '';
    $scope.search = function(value)
    {
      console.log("Search value " + value)
    }

    //Bind data in html to function
    $scope.reloadTable = function(perpage, currentpage)
    {

      //Warning: if data is coming from input
      //we must convert string to integer (just in case)
      perpage = parseInt(perpage);
      if (isNaN(perpage)) {
        perpage = perpageDefault;
      }
      currentpage = parseInt(currentpage);
      if (isNaN(currentpage)) {
        currentpage = currentpageDefault;
      }
      //console.log(perpage);

      // Get the data (as a promise)
      var promise = DataResource.get("data", perpage, currentpage);

      // Use the data promise
      promise
        //Success
        .then(function(data) {

          //assign data to scope
          $scope.datacount = data.count;
          $scope.data = data.items;
          var from = (perpage * (currentpage-1)) +1;
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
