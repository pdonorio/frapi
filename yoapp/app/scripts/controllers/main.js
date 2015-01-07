'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp
  .controller('MainController', function ($scope, DataResource, $location, $filter)
  {

    // Build dynamic menu in header
    $scope.menu = [
        {active:true, link:'', name:'home'},
        {active:false, link:'about', name:'submit'},
        {active:false, link:'search', name:'search'},
        {active:false, link:'about', name:'changelog'},
        {active:false, link:'about', name:'about'},
    ];
    // Fix menu in the header.
    // Make active only the button which leads to current path.
    $scope.$on('$locationChangeStart', function(event) {
        var p = $location.path();
        p = p.substring(1, p.length);
        for (var i = 0; i < $scope.menu.length; i++) {
            if ($scope.menu[i]['link'] == p) {
                $scope.menu[i]['active'] = true;
            } else {
                $scope.menu[i]['active'] = false;
            }
        };
    });

    // editable element via xeditable
    $scope.edit = { switch: false };

    // Query api
    var perpage = 5;
    var currentpage = 1;
    DataResource.get("webcontent", perpage, currentpage)    // Use the data promise
      .then(function(data) {  //Success
          console.log(data);

//////////////////////////////////////
          //BUILD $scope.elements
          $scope.data = data.items;
//////////////////////////////////////

      }, function(object) {      //Error
        console.log("Controller api call Error");
        console.log(object);
      }
    );

    $scope.elements = {
        a: { content : '<h1>Main text</h1>', highlight: false },
        b: { content : '<h4>Title</h4>', highlight: false },
        c: { content : '<p> This is a description for my application. </p>', highlight: false },
        d: { content : '<h4>Karma</h4>', highlight: false },
        e: { content : '<p>Spectacular Test Runner for JavaScript. </p>', highlight: false },
    };

  });
