
//ROUTING new
myApp
.config(function($stateProvider, $urlRouterProvider) {

  // Set up the states and URL routing
  $stateProvider

    // For each page i didn't setup
    .state('notfound', {
      url: "/404",
      views: { "main": { templateUrl: "views/oops.html", }, },
    })
    // Static welcome page
    .state('welcome', {
      url: "/static",
      views: { "main": { templateUrl: "views/welcome.html", }, },
    })
    // Simple login logic
    .state('dologin', {
      url: "/login",
      views: { "main": { templateUrl: "views/login.html", }, },
    })

// Once Logged
// Once Logged
    //LOGGED ROOT
    .state('logged', {
      url: "/app",
      resolve: {
        tester: function($stateParams) {
          return $stateParams;
        },
      },
      views: {
        "main": {
            templateUrl: "views/app.html",
            //VERY IMPORTANT: controller have to be associated inside views
            //when using multiple views, NOT OUTSIDE
            controller: 'MainController',
            //this controller scope will be inherited from every child
        },
        //reminder: this line below will not work as the 'contain' view is nested!
        //"contain": { templateUrl: "views/main.html", },
      }, onEnter: function($rootScope, $state) {
        // Signal to remove background and add body pad for the topbar
        $rootScope.$emit('rootScope:emit', 'padon');
      }, onExit: function($rootScope){
        $rootScope.$emit('rootScope:emit', 'padoff');
      },
    })
    // LOGGED Child routes (sub view, nested inside parent)
      .state('logged.main', {
        url: "/main",
        views: {
          "contain": {
            templateUrl: "views/main.html",
          },
          "extra": {
            templateUrl: "views/datatable.html",
            controller: 'ViewController',
          },
        },
        onEnter: function($rootScope) {
          //make project text appear
          $rootScope.searching = false;
          $rootScope.$emit('rootScope:emit', 'gbgoff');
        },
      })
      .state('logged.submission', {
        url: "/add/{myId:[0-9\-a-z]*}",
        views: { "contain": {
          templateUrl: "views/submit.html",
          controller: 'SubmissionController',
        }, },
        onEnter: function($rootScope) {
          $rootScope.$emit('rootScope:emit', 'gbgoff');
        }, onExit: function($rootScope, $stateParams){
          if ($stateParams.myId != 'new') {
            $rootScope.$emit('rootScope:emit', 'editon');
            //$rootScope.broadcast('edit',false);
          }
        },

      })
      .state('logged.search', {
        url: "/search",
        views: {
          "contain": {
            templateUrl: "views/datatable.html",
            controller: 'ViewController',
          },
        },
        onEnter: function($rootScope) {
            $rootScope.$emit('rootScope:emit', 'gbgon');
            //$rootScope.$emit('rootScope:emit', 'foooff');
        },
      })
      .state('logged.view', {
        url: "/view/{myId:[0-9\-a-z]+}",
        views: { "contain": {
          templateUrl: 'views/viewer.html',
          controller: 'ViewerController',
        }, },
        onEnter: function($rootScope) {
            // send broadcast signal to who is listening:
            // i want the grey background (gbg)
            $rootScope.$emit('rootScope:emit', 'gbgon');
            //$rootScope.$emit('rootScope:emit', 'foooff');
        },
      })
      .state('logged.about', {
        url: "/about",
        views: { "contain": {
          templateUrl: "views/change.html",
          controller: 'SomeController',
        }, },
        onEnter: function($rootScope) {
          $rootScope.$emit('rootScope:emit', 'gbgoff');
          //$rootScope.$emit('rootScope:emit', 'fooon');
        },
      })
// Once Logged
// Once Logged
  ; //routing end

  //Alias for no url?
  $urlRouterProvider.when('', '/static');

  // Redirect if unknown state
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $injector.invoke(['$state', function ($state) {
      console.log("Unknown");
      console.log($location);
      $state.go('notfound');
    }]);
    return true;
  });
});

// enable html5Mode for pushstate ('#'-less URLs)
//$locationProvider.html5Mode(true);