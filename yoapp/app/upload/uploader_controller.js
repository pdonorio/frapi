'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:UploadcontrollerCtrl
 * @description
 * # UploadcontrollerCtrl
 * Controller of the yoApp
 */
myApp
  .controller('UploadController', function (
    $scope, AppConfig, FileUploader,
    $rootScope, DocumentsFactory, NotificationData)
{

    var shortMessageTime = 2000;

    //Init uploader
    $scope.uploader = new FileUploader();
    //Set upload path
    $scope.uploader.url = AppConfig.apiFileBase;

    $scope.uploader.onAfterAddingFile = function(item) {
        var msg = "File <b>" + item._file.name + "</b>"
            + "<br>pronto al caricamento "+
            "<i class=\"fa fa-upload fa-fw\"></i> <br>";
        //NotificationData.setNotification(AppConfig.messageStatus.success, msg, shortMessageTime);
        $scope.noOtherUploads = false;
        //console.log(item);
    }

/*
    onBeforeUploadItem function(item) {
    onSuccessItem function(item, response, status, headers) {

//DOES NOT WORK WELL ?
    $scope.uploader.onProgressItem = function(item, progress) {
        var msg = "File " + item._file.name + "<br>\n";
    }
*/

    function stripHtml(text) {
        text = String(text).replace(/<[^>]+DOCTYPE[^>]+>/gm, '');
        text = String(text).replace(/<title>[^<]+<\/title>/gm, '');
        text = String(text).replace(/h1>/gm, 'h3>');
        text = String(text).replace(/p>/gm, 'span>');
        //text = String(text).replace(/<[^>]+>/gm, '');
        return text;
    }
    $scope.uploader.onErrorItem = function(item, response, status, headers) {
        item.MsgError = stripHtml(response);
    }
    $scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
        item.MsgError = "Disk permission error for local file";
    }

/* useless
    $scope.uploader.onCancelItem = function(item, response, status, headers) {
        var msg = "File <b>" + item._file.name + "</b> <br>caricamento annullato<br>\n";
        //NotificationData.setNotification(AppConfig.messageStatus.warning, msg, shortMessageTime);
    }
    $scope.myRemoveItem = function(item) {
        var msg = "File <b>" + item._file.name + "</b> <br>Rimosso dalla coda<br>\n";
        item.remove();
        //NotificationData.setNotification(AppConfig.messageStatus.warning, msg, shortMessageTime);
    }
*/
    $scope.uploader.onCompleteItem = function(item, response, status, headers)
    {
        //console.log(item);
        var msg = "File: <b>" + item._file.name + "</b> <br>"
            + "Tipologia: " + item._file.type + "<br>";

        // Check html status code from API response
        if (item._xhr.status > 210) {

/*
            item.MsgError = "Error: " + item._xhr.status + ":" +
                item._xhr.statusText + "\n" + item._xhr.response + "\n";
*/
        } else {
            //msg += "Salvato sul server con successo";

            // API DB CALL to save
            DocumentsFactory.set($scope.myrecordid, item._file.name, item._file.type, $rootScope.user.myid)
             .then(function(data) {
                // This function is defined in submission_controllers.js...
                $rootScope.refreshDocs();
            });
        }

        // Handle buttons: clean them if no files to be uploaded yet
        $scope.noOtherUploads = true;
        for (var i = 0, len = $scope.uploader.queue.length; i < len; i++) {
            if (!$scope.uploader.queue[i].isUploaded) {
                $scope.noOtherUploads = false;
                break;
            }
        }
    }

    // Init variable
    $scope.noOtherUploads = true;

});
