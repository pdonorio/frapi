'use strict';

/**
 * @ngdoc directive
 * @name yoApp.directive:editableContent
 * @description
 * # editableContent
 */

myApp
  .directive('editableContent', function (mixed) {
    return {

      //create my tab editable_content
      restrict: 'E',
      //create a template to work data inside the markup
      templateUrl: 'templates/editable.html',

      /////////////////////////////////////
      //Directives may use an isolated scope (cleaner and better)
      scope: {
        // = allows data to be passed into directive from controller scope
        data: '=?',      //different for each call
        pos: '=?',      //different for each call
        //should be the same for all replicated directives,
        //one switch for all page text data
        editable: '=flag',
      },

/*
      link: function (scope, iElement, iAttrs, NotificationController) {
        // Allow the controller here to access the document controller
        scope.notify = NotificationController;
        //NotificationController.setNotification(2,"test me");
      },
*/

      /////////////////////////////////////
      //manage the local scope
      controller: function($scope, $timeout, $location, DataResource, AppConfig, messageTimeout, NotificationData)
      {
        //check inside the array
        $scope.item = $scope.data[$scope.pos];
        //default item value if no consistent data or no text
        $scope.item = mixed($scope.item, true);

        /////////////////////////////////////
        //Do everything on the current item
        //Then send the new data to update via API
        $scope.updateContent = function() {

          // Signal that we are going to try to edit data
          NotificationData.setNotification(AppConfig.messageStatus.loading, "");

          var id = null;
          if ($scope.data[$scope.pos]) {
              var tmp = $scope.data[$scope.pos];
              id = tmp.id;
              //init data making use of shared Provider utility
              $scope.data[$scope.pos] = mixed(tmp, false);
          }
          var data = {
            id: id,
            content: $scope.item.content,
            element: $scope.pos,
  //TO FIX - select page from ui router, also dynamic language
            // this is wrong, because it contains params inside the url...
            page: $location.path(),
            // fixed for now
            language: "french",
          };

          $scope.item.highlight = false;
          var msg = "";
        // API UPDATE ^_^
          DataResource.set("webcontent", data)
          .then(function() {

//TO FIX - should this stay inside link function?
// it works on HTML and DOM
              msg = "Saved content<br> <div class='well'>"+ $scope.item.content +"</div>";
              NotificationData.setNotification(AppConfig.messageStatus.success, msg);
            }, function() {
              console.log("Factory/Service api call Error: POST");
              msg = "Could not save the new content<br> " +
                "<div class='well'>"+ $scope.item.content +"</div>" +
                "<br> <br> Please try again in a few minutes." +
                "";
              NotificationData.setNotification(AppConfig.messageStatus.error, msg);
            }
          );

        }

      },

    };
  });
