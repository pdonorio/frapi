'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp
  .controller('MainController', function ($scope, $location, $filter)
  {
    $scope.menu = [
        {active:true, link:'', name:'home'},
        {active:false, link:'about', name:'submit'},
        {active:false, link:'search', name:'search'},
        {active:false, link:'about', name:'changelog'},
        {active:false, link:'about', name:'about'},
    ];

    // editable element via xeditable
    $scope.user = {
        name: 'awesome user'
    };
    $scope.hcontent = {
        a: '<h1>Main name</h1>',
        b: '<h4>Title</h4>',
        c: '<p> This is a description for my application. </p>',
    };

    $scope.$on('$locationChangeStart', function(event) {
        var p = $location.path();
        p = p.substring(1, p.length);
        //console.log(p);
        for (var i = 0; i < $scope.menu.length; i++) {
            if ($scope.menu[i]['link'] == p) {
                $scope.menu[i]['active'] = true;
            } else {
                $scope.menu[i]['active'] = false;
            }
        };
        //console.log($scope.menu);
    });


  });
