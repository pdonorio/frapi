'use strict';

myApp

// Task controller
.controller('TaskController', function ($rootScope, $scope, $filter, Logger, Planner)
{
    var logger = Logger.getInstance('tasking_ctrl');

    $scope.update = function(index) {
        // Tasks via API
        Planner.get().then(function(data){
            $scope.tasks = angular.copy(data);
            logger.debug("View updated");

            if (index) {
                $scope.tasks.forEach(function(obj, key){
                    if (obj.id == index) {
                        logger.debug("Active task", key);
                        $scope.tasks[key].active = true;
                    }
                });
            }
        });
    }

    $scope.addComment = function(task) {
        Planner.addComment(task, $rootScope.user.myid).then(function(){
            $scope.update(task);
        });
    }

    // First time listing
    $scope.update();
});
