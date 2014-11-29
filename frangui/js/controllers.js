//###########################################
//controller
myModule.controller('TableController', function($scope, Api, $timeout)
{

    //make the call to Api get - use promises
    Api.get().then(function(data) {
       //this will execute when the AJAX call completes.
       $timeout( function() {
         $scope.test = data;
        //sleep one second
       }, 1000);
       // console.log($scope.test);
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