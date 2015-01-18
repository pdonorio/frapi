'use strict';

/**
 * @ngdoc service
 * @name yoApp.NotificationService
 * @description
 * # NotificationService
 * Service in the yoApp.
 */
myApp
 .service('NotificationData', function ($timeout, AppConfig, messageTimeout) {

//init structure
 var emptyMessage = {
    status: AppConfig.messageStatus.none,
    message: "",
    timeout: null,
 };
 var myMessage = angular.copy(emptyMessage);

 return {

    messageStatus: AppConfig.messageStatus.none,

    getNotificationStatus: function () {
        return this.messageStatus;
    },

    setNotificationStatus: function (status) {
        this.messageStatus = status;
    },

    setNotification : function(status, message) {

        //console.log($scope.myMessage);     //DEBUG
        console.log("Calling with "+status+","+message);

        myMessage.status = status;
//NOTE TO MY SELF:
//Message should be a different variable per each notification...?

        //if timeout exists: remove it
        //i have to avoid that an old timeout close my message
        if (myMessage.timeout) {
            //console.log("Timeout exit");
            $timeout.cancel(myMessage.timeout);
            myMessage.timeout = emptyMessage.timeout;
        }

        // Handling timeout & message if status different from
        // 0 no message, 1 loading
        if (status > AppConfig.messageStatus.loading)
        {
            myMessage.message = message;
            //in some seconds i want message to disappear
            //console.log("Start timeout of "+messageTimeout);

            //should this be optional?
            myMessage.timeout = $timeout(function() {
                    //only updating default status to make
                    //message disappear
                    myMessage.status = emptyMessage.status;
                    myMessage.timeout = emptyMessage.timeout;
                }, messageTimeout
            );
        }
    }
 };

 });
