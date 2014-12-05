//###########################################
//CONTROLLER
myModule
  .constant("perpage_default", 10)
  .controller('TableController', function($scope, DataResource, perpage_default)
{

    // Init: Html scope data
    $scope.datacount = 0;
    $scope.data = {};
    $scope.headers = [ "", "Key", "Value" ];
    $scope.perpage = perpage_default;

    //Bind data in html to function
    $scope.reloadTable = function(perpage)
    {

      //Warning: if data is coming from input
      //we must convert string to integer (just in case)
      perpage = parseInt(perpage);
      if (isNaN(perpage)) {
        perpage = perpage_default;
      }
     //console.log(perpage);

      promise = DataResource.get("data", perpage);

      promise
        //Success
        .then(function(data) {
          $scope.datacount = data.count;
          $scope.data = data.items;
        },
        //Error
        function(object) {
          console.log("Controller api call Error");
          console.log(object);
        }
      );

    }

    // First time call to get data
    $scope.reloadTable($scope.perpage);
    /* HOW TO CACHE ?? */

    // DEBUG factory result
    //console.log(promise);

    //end
});