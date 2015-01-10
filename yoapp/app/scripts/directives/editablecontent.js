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

      /////////////////////////////////////
      //manage the local scope
      controller: function($scope, DataResource) {

        //check inside the array
        $scope.item = $scope.data[$scope.pos];
        //default item value if no consistent data or no text
        $scope.item = mixed($scope.item, true);

        /////////////////////////////////////
        //Do everything on the current item
        //Then send the new data to update via API
        $scope.updateContent = function() {

          // Signal that we are going to try to edit data
          $scope.item.status = 3;

  //TO FIX - select page from somewhere
          var id = null;

          if ($scope.data[$scope.pos]) {
              id = $scope.data[$scope.pos].id;
              //init data making use of shared Provider utility
              $scope.data[$scope.pos] = mixed($scope.data[$scope.pos], false);
          }
          var data = {id: id,
            content: $scope.data[$scope.pos].content,
            element: $scope.pos, page: "" };

          $scope.item.highlight = false;
        // API UPDATE ^_^
          DataResource.set("webcontent", data)
          .then(function() {
              $scope.item.status = 1;
            }, function() {
              console.log("Factory/Service api call Error: POST");
              $scope.item.status = 2;
            }
          );

        }

      },

    };
  });
