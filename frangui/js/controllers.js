
//###########################################
//controller
myModule.controller('TableController', ['$scope', 'Restangular',
  function($scope, Restangular) {

    //INIT
    $scope.datacount = 0;
    $scope.data = {};
    $scope.headers = [ "", "Key", "Value" ];

    // All URLs on searches will use `http://google.com/` as the baseUrl
    api = Restangular.allUrl('pyapi','http://awesome.dev:5507');
    api.customGET("data").then(function(output) {
      data = JSON.parse(output);
      //console.log(data);
      $scope.datacount = data.count;
      $scope.data = data.items;
    });


/*

    //make the call to Api get - use promises
    Api.get().then(function(result) {
       //this will execute when the AJAX call completes.
        console.log(result);
        $scope.datacount = result.data.count
        $scope.data = result.data.items;
// # TO FIX -
        //what to do if status > 0 (== error)?
    });

*/

/* FROM THE EXAMPLE.....

    //add
    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false});
      $scope.todoText = '';
    };
    //count
    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
    //archive
    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    };
*/

    //end
  }]);