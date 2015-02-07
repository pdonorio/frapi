'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the yoApp
 */
myApp
.controller('MainController', function ($scope, $rootScope, $timeout, $interval, $location,
    //tester,
    projectName, DataResource, mixed, warningInitTime, someInitTime, apiTimeout)
{
    $scope.projectName = projectName;
    $rootScope.lastVisited = undefined;

    // Function to simplify href on buttons via Angular
    $scope.go = function ( path ) {
      $location.path( path );
      $rootScope.lastVisited = undefined;
    };

/*
    //////////////////////////////////////
    // Lo.dash | underscore
    $scope._ = _;
    // Very easy to use: a range for my editable directive
    $scope.range = _.range(1, 7);
*/
    $scope.elements = {};
    //API give me access to HTML content inside database

    //////////////////////////////////////
    // Build dynamic menu in header
    $rootScope.menu = [
        {active:true,  link:'logged.main', name:'main', icon:'home', },
        //{active:false, link:'logged.submission', name:'add'},
        //{active:false, link:'logged.search', name:'search'},
        {active:false, link:'logged.about', name:'about', icon:'info-circle', },
    ];
    // Function to set active element
    $rootScope.setActiveMenu = function(current) {
      for (var i = 0; i < $rootScope.menu.length; i++) {
        if ($rootScope.menu[i]['name'] == current) {
            $rootScope.menu[i]['active'] = true;
        } else {
            $rootScope.menu[i]['active'] = false;
        }
      };
    }
    // SET ACTIVE ELEMENT - FIRST TIME
    //getting current location
    var tmp = $location.url().split('/');
    // coming from /app/some, so 0 = "", 1 = "app", 2 = "some"
    if (tmp[2]) {
      $rootScope.setActiveMenu(tmp[2]);
    }
    // SET ACIVE ELEMENT - ANY OTHER TIME
    $rootScope.$on('$stateChangeStart', function (event, nextState, npar, currentState, cpar) {

      var p = nextState.url;
      var p = p.substring(1, p.length);
      $rootScope.setActiveMenu(p);

//TO FIX - not very straightforward...
      // BACK BUTTON inside TOPBAR
      // Work on latest states
      var tmp = currentState.url;
      if (cpar.myId) {
          var x = currentState.url.split("/");
          tmp = '/' + x[1] + '/' + cpar.myId;
      }
      // don't wanto to go back from main views
      if (npar.myId) {
          // Use latest visited URL
          $rootScope.lastVisited = 'app' + tmp;
      }
      //console.log($rootScope.lastVisited);

/*      AUTH?
        if (!isAuthenticated(nextState)) {
            console.debug('Could not change route! Not authenticated!');
            $rootScope.$broadcast('$stateChangeError');
            e.preventDefault();
            $state.go('login');
        }
*/
    });

    //////////////////////////////////////
    // INIT for loading the app based on API status
    $scope.init = {
        //startup : true, //DEBUG
        startup: false,
        status: 0,
    };
    // If taking too long show a little warning
    var longerThanUsual = $timeout(function() { $scope.init.status = 2; }, warningInitTime );
    // Progress bar
    $scope.progress = {
        type: "warning",
        value: 0, //percent
    }
    var secondsStep = 3;
    var maxStep = 100;
    var intervalStep = maxStep / secondsStep;
    var timeStep = apiTimeout / intervalStep;
    var progressInterval = $interval(function() { $scope.progress.value += secondsStep; }, timeStep);

    //////////////////////////////////////
    // Query api - READ the whole html content
    DataResource.get("webcontent")
        .then(function(data) {

            var tmp = data.items;
            //Check the data received
            if (tmp) {
                //Set data based on database element position saved
                for (var i = 0; i < tmp.length; i++) {
                    var j = tmp[i].element;
                    $scope.elements[j] = tmp[i];
                };
                $rootScope.edit = {
                    state: 0,
                    switch: $rootScope.edit.switch,
                    available: $rootScope.edit.available,
                };

                //Getting progress closer
                $timeout(function() { $scope.progress.value += ((maxStep - $scope.progress.value) / 2); }, someInitTime / 2 );
                $timeout(function() { $scope.progress.value = 99;  }, someInitTime - 100 );
                //Let the page appear, after some init time
                $timeout(function() {
                    $scope.init.startup = true;
                    //$scope.progress.value=99;
                    $interval.cancel(progressInterval);
                }, someInitTime );

            } else {
                //Could recover some sort of error from Factory api call?
                console.log("No data from API");
                //Signal init error
                $scope.init.status = 1;
                //Don't let the warning appear if this happened at the very beginning
                $timeout.cancel(longerThanUsual);
                $interval.cancel(progressInterval);
                //disable any admin edit if page loads
                $rootScope.edit = { switch: false, state: 1, available: false };
            }

        }, function(object) {      //Error? Uhm
            alert("There was a BIG problem!!");
        }
    );

});