'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:UploadcontrollerCtrl
 * @description
 * # UploadcontrollerCtrl
 * Controller of the yoApp
 */
myApp
  .controller('UploadController', function ($scope, AppConfig, FileUploader,
    $rootScope, DocumentsFactory, NotificationData)
{

    var shortMessageTime = 2000;

    //Init uploader
    $scope.uploader = new FileUploader();
    //Set upload path
    $scope.uploader.url = AppConfig.apiFileBase;

/*
    onBeforeUploadItem function(item) {
    onSuccessItem function(item, response, status, headers) {
*/

    $scope.uploader.onAfterAddingFile = function(item) {
        var msg = "File <b>" + item._file.name + "</b>"
            + "<br>pronto al caricamento "+
            "<i class=\"fa fa-upload fa-fw\"></i> <br>";
        NotificationData.setNotification(AppConfig.messageStatus.success, msg, shortMessageTime);
    }

/*
DOES NOT WORK WELL
    $scope.uploader.onProgressItem = function(item, progress) {
        var msg = "File " + item._file.name + "<br>\n";
        NotificationData.setNotification(AppConfig.messageStatus.loading, msg);
    }
*/
    $scope.uploader.onErrorItem = function(item, response, status, headers) {
        var msg = "File " + item._file.name + "<br>Fallito <br>\n";
        NotificationData.setNotification(AppConfig.messageStatus.error, msg);
    }
    $scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
        var msg = "File " + item._file.name +
            "<br>Problema locale con permessi disco<br>\n";
        NotificationData.setNotification(AppConfig.messageStatus.error, msg);
    }
    $scope.uploader.onCancelItem = function(item, response, status, headers) {
        var msg = "File <b>" + item._file.name + "</b> <br>caricamento annullato<br>\n";
        NotificationData.setNotification(AppConfig.messageStatus.warning, msg, shortMessageTime);
    }
    $scope.myRemoveItem = function(item) {
        var msg = "File <b>" + item._file.name + "</b> <br>Rimosso dalla coda<br>\n";
        item.remove();
        NotificationData.setNotification(AppConfig.messageStatus.warning, msg, shortMessageTime);
    }

    $scope.uploader.onCompleteItem = function(item, response, status, headers)
    {
        //console.log(item);
        var msg = "File: <b>" + item._file.name + "</b> <br>"
            + "Tipologia: " + item._file.type + "<br>";

        // Check html status code from API response
        if (item._xhr.status > 210) {
            msg +=
                "Errore " + item._xhr.status + ":" +
                item._xhr.statusText + "\n" +
                item._xhr.response + "\n";
        } else {
            msg += "Salvato sul server con successo";
            // API DB CALL to save
            DocumentsFactory.set($scope.myrecordid, item._file.name, item._file.type, $rootScope.user.myid)
             .then(function(data) {
                //console.log("ID",$scope.myrecordid);
                // Update view
                DocumentsFactory.get($scope.myrecordid).then(function(out){
                    $scope.docs = out.items;
                });
                //console.log("Saved inside db", data);
            });
        }
        NotificationData.setNotification(AppConfig.messageStatus.success, msg);

// TO FIX -

// IF all files completed:
// I SHOULD CLEAN THE FILE BUTTONS!

    }

    //DEBUG
    //console.log($scope);

});
