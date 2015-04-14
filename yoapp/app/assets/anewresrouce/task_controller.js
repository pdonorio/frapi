'use strict';

myApp

// Task controller
.controller('TaskController', function ($scope, Logger, Planner)
{
    var logger = Logger.getInstance('tasking_ctrl');

    // Tasks via API
    Planner.get().then(function(data){
        $scope.tasks = data;
    });

});
