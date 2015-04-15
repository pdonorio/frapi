'use strict';

myApp

// Task controller
.controller('TaskController', function ($rootScope, $scope, $filter, Logger, Planner, userlist)
{
    var logger = Logger.getInstance('tasking_ctrl');
    //console.log(userlist);

    $scope.update = function(index) {
        // Tasks via API
        Planner.get().then(function(data){
            $scope.tasks = angular.copy(data);
            logger.debug("View updated");

            $scope.tasks.forEach(function(obj, key){
                // Filter user name
                obj.comments.forEach(function(element, index){
                    element.myuser = userlist[element.user];
                });
                if (index && obj.id == index) {
                    logger.debug("Active task", key);
                    $scope.tasks[key].active = true;
                }
                //console.log("TEST", obj);
            });
        });
    }

    $scope.addComment = function(task) {
        Planner.addComment(task, $rootScope.user.myid).then(function(){
            $scope.update(task);
        });
    }
    $scope.updateComment = function(comment, task) {
        Planner.updateComment(comment, task, $rootScope.user.myid).then(function(){
            $scope.update(task);
        });
    }

    // First time listing
    $scope.update();
});
