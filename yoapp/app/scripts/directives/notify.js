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

      // 'item' is my internal object,
      // with status and message and latest timeout
      controller: function($scope, $timeout, messageTimeout)
      {
        //init structure
        var empty = {
            status: 0,
            message: "",
            timeout: null,
        }
        //do not pass this as a reference...
        $scope.item = angular.copy(empty);

        $scope.setNotification = function(status, message)
        {
            $scope.item.message = message;
            $scope.item.status = status;

            // Handling timeout
            if (status > 1) {
                //in some seconds i want message to disappear
                //should this be optional?
                $scope.item.timeout = $timeout(function() {

                        //only updating default status to make
                        //message disappear
                        $scope.item.status = angular.copy(empty.status);
                        $scope.item.timeout = angular.copy(empty.timeout);
                    }, messageTimeout
                );
            } else {
                //if i go to status normal or loading
                //i have to avoid that an old timeout close my message
                if ($scope.item.timeout) {
                    //console.log("Timeout exit");
                    $timeout.cancel($scope.item.timeout);
                    $scope.item.timeout = angular.copy(empty.timeout);
                }
            }
        }
      }

    };
  });
