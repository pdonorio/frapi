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

      //item is my internal object, with status and message
      controller: function($scope, $timeout, messageTimeout)
      {
        var empty = {
            status: 0,
            message: "",
        }
        $scope.item = empty;

        $scope.setNotification = function(status, message)
        {
            $scope.item = {
                status: status,
                message: message,
            }
            if (status > 1) {
                $timeout(function()
                {
                    //only updating default status to make
                    //message disappear
                    $scope.item.status = empty.status;
                }, messageTimeout);
            }
        }
      }

    };
  });
