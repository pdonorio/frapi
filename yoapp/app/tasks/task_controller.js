'use strict';

myApp

// Task controller
.controller('TaskController', function ($scope, Planner)
{

    // Tasks via API?
    $scope.tasks = Planner.get();

});
