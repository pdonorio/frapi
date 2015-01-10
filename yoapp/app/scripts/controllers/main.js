'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp.controller('MainController',
    function ($scope, DataResource, $location, mixed)
{
    // Lo.dash | underscore
    $scope._ = _;
    // Very easy to use
    $scope.range = _.range(1, 11);

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
    var perpage = 1000;
    DataResource
        .get("webcontent", perpage, 1)    // Use the data promise
        .then(function(data) {

            var tmp = data.items;

            //Check the data received
            if (tmp) {
                //Set data based on database element position saved
                for (var i = 0; i < tmp.length; i++) {
                    var j = tmp[i].element;
                    $scope.elements[j] = tmp[i];
                };

            } else {
                //Could recover some sort of error from Factory api call?
                console.log("No data from API");
            }

        }, function(object) {      //Error? Uhm
            alert("There was a BIG problem!!");
        }
    );

    //////////////////////////////////////
    // Query api - WRITE

    $scope.update = function(pos, newcontent) {
//TO FIX - select page from somewhere

        var id = null;
        if ($scope.elements[pos]) {
            id = $scope.elements[pos].id;
            //init data making use of shared Provider utility
            $scope.elements[pos] = mixed($scope.elements[pos], false);
        }
        var data = {id: id, content: newcontent, element: pos, page: "" };
        //console.log(data);

        //UPDATE data using Dataresource (restangular) to post
        DataResource.set("webcontent", data).then();

    };

});
