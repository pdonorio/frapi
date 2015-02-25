'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ViewController
 * @description
 * # ViewController
 * Controller of the yoApp
 */

myApp
 .controller('ViewController', function ($scope, $rootScope, API, perpageDefault, currentpageDefault)
{
    // Init: Html scope data
    $scope.datacount = 0;
    $scope.from = 0;
    $scope.data = {};
    $scope.headers = [
      //"Id",
      "Chiave", "Valore", "Azioni" ];
    $scope.perpage = perpageDefault;
    $scope.currentpage = currentpageDefault;

    // Closed advanced search
    $scope.isCollapsed = true;

    // What to do on focus
    $scope.doFocus = function () {
      $scope.mytable.show = true;
      $rootScope.searching = true;
      $rootScope.edit.available = false;
    }

  /* ************************************
  ***************************************
   TYPEAHEAD
  ***************************************
  ************************************* */

    $scope.selected = undefined;
    $scope.search = function()
    {
      console.log("Searching: " + $scope.selected);

// TO FIX -
      //should check if this value has already been requested

      //1. Skip if equal to latest
      //2. Cache?
    }
    $scope.onTypeaheadSelect = function (item, model, label)
    {
      $scope.search(item);
      // console.log("Item "+item);
      // console.log("Model "+model);
      // console.log("Label "+label);
    }

    $scope.typeahead = {
      data: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    };


  /* ************************************
  ***************************************
   Refresh datatable from API call
  ***************************************
  ************************************* */

    //Bind data in html to function
    $scope.reloadTable = function(perpage, currentpage)
    {

      // Get the data (as a promise)
      var params = {perpage: perpage, currentpage: currentpage};
      var promise = API.get("data", params);

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
