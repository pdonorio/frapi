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

    //////////////////////////////////////
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

    //////////////////////////////////////
    // editable element via xeditable
    $scope.edit = { switch: false };
    $scope.elements = {};

    //////////////////////////////////////
    // Query api - READ
    var perpage = 5;
    var currentpage = 1;
    DataResource.get("webcontent", perpage, currentpage)    // Use the data promise
      .then(function(data) {  //Success
        console.log("Read");
        var tmp = data.items;
        for (var i = tmp.length - 1; i >= 0; i--) {
            //Should define as empty what is missing
            $scope.elements[i] = { content: tmp[i].content, highlight: false };
        };
      }, function(object) {      //Error
        console.log("Controller api call Error");
        console.log(object);
      }
    );

    //////////////////////////////////////
    // Query api - WRITE
    $scope.update = function(content, pos) {
        console.log(content);
        console.log(pos);
        //UPDATE data using Dataresource (restangular) to post
    };

  });
