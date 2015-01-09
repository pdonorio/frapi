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
        //referencing action attribute to pass a function from controller
        // see: https://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-2-isolate-scope
        action: '&',
      },

      /////////////////////////////////////
      //manage the local scope
      controller: function($scope) {
        //An empty html block is:
        var empty = {
          id: null, highlight: false,
          content: '<span class="myred">Not defined yet</span>',
        };
        //check inside the array
        $scope.item = $scope.data[$scope.pos];
        //default item value if no consistent data or no text
        $scope.item = mixed($scope.item, true);

      },

    };
  });
