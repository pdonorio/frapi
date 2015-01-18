'use strict';

/**
 * @ngdoc directive
 * @name yoApp.directive:notify
 * @description
 * # notify
 */
myApp
  .directive('notify', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/notification.html',
      scope : false,

      controller: function($scope, AppConfig, NotificationData)
      {

        //share config constants within current $scope
        if (!$scope.msgStatus) {
            //set this only once in this local scope
            //and only if this directive is used
            $scope.msgStatus = AppConfig.messageStatus;
        }

        $scope.$watch(function(){
            return NotificationData.messageStatus;
        }, function(newValue, oldValue){
            console.log("Changing "+newValue+","+oldValue)
        });
      }


    };
  });
