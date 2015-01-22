'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp.controller('MainController',
    [ '$scope', '$location', '$timeout', 'DataResource', 'mixed','warningInitTime', 'someInitTime',
        function ($scope, $location, $timeout, DataResource, mixed, warningInitTime, someInitTime)
{
    // INIT for loading
    $scope.init = {
        //startup : true,
        startup: false,
        status: 0,
    };
    // If taking too long show a little warning
    var longerThanUsual =
        $timeout(function() { $scope.init.status = 2; }, warningInitTime );

/*
    //debug INIT
    $timeout(function() {
        $scope.init.startup = true;
        $scope.init.status = 0;
    }, warningInitTime + 3000 );
*/

    // Lo.dash | underscore
    $scope._ = _;
    // Very easy to use: a range for my editable directive
    $scope.range = _.range(1, 7);

    //////////////////////////////////////
    // Build dynamic menu in header
    $scope.menu = [
        {active:true,  link:'',       name:'home'},
        {active:false, link:'submit', name:'add'},
        {active:false, link:'search', name:'search'},
        {active:false, link:'change', name:'about'},
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
    $scope.edit = {
        state: 1,
        switch: false,
        //switch: true,
    };
    $scope.elements = {};

    //////////////////////////////////////
    //API give me access to HTML content inside database
    //////////////////////////////////////

    //////////////////////////////////////
    // Query api - READ the whole html content
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
                var current = $scope.edit.switch;
                $scope.edit = { state: 0, switch: current };

                //Let the page appear, after some init time
                $timeout(function() {
                    $scope.init.startup = true;
                }, someInitTime );

            } else {
                //Could recover some sort of error from Factory api call?
                console.log("No data from API");
                //Signal init error
                $scope.init.status = 1;
                //Don't let the warning appear if this happened at the very beginning
                $timeout.cancel(longerThanUsual);
                //disable any admin edit if page loads
                $scope.edit = { switch: false, state: 1 };
            }

        }, function(object) {      //Error? Uhm
            alert("There was a BIG problem!!");
        }
    );

}]);
