
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
      .state('logged.home', {
        url: "/home",
        views: { "contain": { templateUrl: "views/main.html", }, },
      })
      .state('logged.submission', {
        url: "/add",
        views: { "contain": {
          templateUrl: "views/submit.html",
          controller: 'SubmissionController',
        }, },
      })
      .state('logged.search', {
        url: "/search",
        views: { "contain": {
          templateUrl: "views/datatable.html",
          controller: 'ViewController',
        }, },
      })
      .state('logged.about', {
        url: "/about",
        views: { "contain": {
          templateUrl: "views/change.html",
          controller: 'SomeController',
        }, },
      })
// Once Logged
// Once Logged
  ; //routing end

  //Alias for no url?
  $urlRouterProvider.when('', '/static');

  // Redirect if unknown state
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $injector.invoke(['$state', function ($state) {
      $state.go('notfound');
    }]);
    return true;
  });

});

/*
      .when('/view/:viewid', {
        templateUrl: 'views/viewer.html',
        controller: 'ViewerController',
      })

  })

*/
      // enable html5Mode for pushstate ('#'-less URLs)
      //$locationProvider.html5Mode(true);

