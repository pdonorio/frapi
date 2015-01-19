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

    //myMessage: angular.copy(emptyMessage),
    counter: 0,

    getNotificationStatus: function () {
        return myMessage.status;
    },
    getNotificationMessage: function () {
        return myMessage.message;
    },
    getNotification: function () {
        return myMessage;
    },

    incrementWatcher: function () {
        this.counter++;
        //console.log("Waking");
    },
    setNotificationStatus: function (status) {
        myMessage.status = status;
    },
    setNotificationMessage: function (message) {
        myMessage.message = message;
    },
    setNotificationTimeout: function (timer) {
        myMessage.timeout = timer;
    },

    setNotification : function(status, message) {

        //notify my application
        this.incrementWatcher();

        //set data inside the factory for sharing
        this.setNotificationMessage(message);
        if (status >= AppConfig.messageStatus.none && status <= AppConfig.messageStatus.error) {
            this.setNotificationStatus(status);
        }

        //if currently timeout exists: remove it!
        //i have to avoid that an old timeout close my message
        if (myMessage.timeout) {
            //console.log("Timeout exit");
            $timeout.cancel(myMessage.timeout);
            myMessage.timeout = emptyMessage.timeout;
        }
    }

  };
 });
