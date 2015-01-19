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
    counter: 0,
 };
 //var myMessage = angular.copy(emptyMessage);

 return {

    myMessage: angular.copy(emptyMessage),
    //messageStatus: AppConfig.messageStatus.none,

    getNotificationStatus: function () {
        return this.myMessage.status;
    },
    getNotificationMessage: function () {
        return this.myMessage.message;
    },
    getNotification: function () {
        return this.myMessage;
    },

    incrementWatcher: function () {
        this.myMessage.counter++;
        //console.log("Waking");
    },
    setNotificationStatus: function (status) {
        this.myMessage.status = status;
    },
    setNotificationMessage: function (message) {
        this.myMessage.message = message;
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
        if (this.myMessage.timeout) {
            //console.log("Timeout exit");
            $timeout.cancel(this.myMessage.timeout);
            this.myMessage.timeout = emptyMessage.timeout;
        }
    }
 };

 });
