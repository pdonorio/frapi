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
        $scope.notification = {
            status: AppConfig.messageStatus.none,
            message: "",
            successMessage: "",
            warningMessage: "",
            errorMessage: "",
        }

        //share config constants within current $scope
        if (!$scope.msgStatus) {
            //set this only once in this local scope
            //and only if this directive is used
            $scope.msgStatus = AppConfig.messageStatus;
        }

        // Registering this controller to a Factory property
        $scope.$watch(function(){
            //What to watch?
            //do not watch the whole object, or angular will not notice
            //if you change only some inside propery...
            return NotificationData.myMessage.counter;
        }, function(newValue, oldValue){
            //What to do if the value changes?

            //console.log("Changing "+newValue+","+oldValue)
            var status = NotificationData.getNotificationStatus();
            var message = NotificationData.getNotificationMessage();

            //If changing to 0 - don't do anything
            if (status == AppConfig.messageStatus.none) {
                //nothing
            //If loading, put the message to empty?
            } else if (status == AppConfig.messageStatus.loading) {
                //nothing
            //Otherwise get the new message and use it
            } else if (status == AppConfig.messageStatus.success) {
                $scope.notification.successMessage = message;
            } else if (status == AppConfig.messageStatus.warning) {
                $scope.notification.warningMessage = message;
            } else if (status == AppConfig.messageStatus.error) {
                $scope.notification.errorMessage = message;
            } else {
                console.log("Unknown status: ",status);
            }

            //set new status for div changing. It happens here.
            $scope.notification.status = status;

/*
            // Handling timeout & message if status different from
            // 0 no message, 1 loading
            if (status > AppConfig.messageStatus.loading)
            {
                //should this be optional?
                this.myMessage.timeout = $timeout(function() {
                        //only updating default status to make
                        //message disappear
                        this.myMessage.status = emptyMessage.status;
                        this.myMessage.timeout = emptyMessage.timeout;
                    }, messageTimeout
                );
            }
*/

        });
      }

    };
  });
