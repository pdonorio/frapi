
//###########################################
//controller
myModule.controller('TableController', function($scope, DataResource) {

    //INIT
    $scope.datacount = 0;
    $scope.data = {};
    $scope.headers = [ "", "Key", "Value" ];

    promise = DataResource.get("data");

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

    // DEBUG factory result
    //console.log(promise);

    //end
});