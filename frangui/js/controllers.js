//###########################################
//CONTROLLER
myModule.controller('TableController', function($scope, DataResource) {

    // Init: Html scope data
    $scope.datacount = 0;
    $scope.data = {};
    $scope.headers = [ "", "Key", "Value" ];

//params?
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