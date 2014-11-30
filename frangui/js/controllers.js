//###########################################
//controller
myModule.controller('TableController', function($scope, Api) {

    //INIT
    $scope.datacount = 0;
    $scope.data = {};
    $scope.headers = [ "", "Key", "Value" ];

    //make the call to Api get - use promises
    Api.get().then(function(result) {
       //this will execute when the AJAX call completes.
        console.log(result);
        $scope.datacount = result.data.count
        $scope.data = result.data.items;
// # TO FIX -
        //what to do if status > 0 (== error)?
    });

/*
    //Implement mock data
    $scope.todos = [
      {text:'learn angular', done:true},
      {text:'build an angular app', done:false}];

    //add data
    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false});
      $scope.todoText = '';
    };

    //count actual data (marked as done)
    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    //archive = delete/push
    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    };
*/

    //end
});