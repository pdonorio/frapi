
//ROUTING new
myApp
.config(function($stateProvider, $urlRouterProvider)
{

  // Set up the states and URL routing
  $stateProvider
    // For each page i didn't setup
    .state('notfound', {
      url: "/404",
      views: { "main": { templateUrl: "login/oops.html", }, },
    })
    // Static welcome page
    .state('welcome', {
      url: "/static",
      views: {
        "main": {
            templateUrl: "login/welcome.html",
            controller: 'MainController',
        },
      },
    })
    // Simple login logic
    .state('dologin', {
      url: "/login/{status:[a-z]+}",
      views: {
        "main": {
            templateUrl: "login/login.html",
            controller: "LoginController",
        },
      }
    })
    .state('dologout', {
      url: "/logout",
      views: { "main": { controller: "LogoutController", } },
    })


///////////////////////////////////////////
// Once Logged
// Once Logged
    //The parent of all logged views
    .state('logged', {

      // Make this PARENT state abstract so it can never be
      // loaded directly
      abstract: true,

      url: "/app",
      views: {
        "main": {
            templateUrl: "views/app.html",
            //VERY IMPORTANT: controller have to be associated inside views
            //when using multiple views, NOT OUTSIDE
            controller: 'MainController',
            //this controller scope will be inherited from every nested child view
        },
      }, onEnter: function($rootScope, $state) {
        // Signal to remove background and add body pad for the topbar
        $rootScope.$emit('rootScope:emit', 'padon');
      }, onExit: function($rootScope){
        $rootScope.$emit('rootScope:emit', 'padoff');
      },
      // Set the current user for the whole application
      resolve: {
        user: 'Account',
      },
    })
/****************************************
/****************************************
/****************************************/
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
          $rootScope.$emit('rootScope:emit', 'editon');
          $rootScope.lastVisited = undefined;
        }, onExit: function($rootScope) {
          $rootScope.edit.available = true;
        }
      })
/****************************************
/****************************************
/****************************************/

      .state('logged.submission', {
        url: "/submission/{myId:[0-9\-a-z]*}",
        views: {
          "contain": {
            templateUrl: 'submission/submission_user_view.html',
            controller: 'SubmissionController',
          },
        },
        onEnter: function($rootScope) {
          $rootScope.$emit('rootScope:emit', 'gbgoff');
          $rootScope.$emit('rootScope:emit', 'editoff');
        },
        // Be sure to have data before loading the page
        resolve: {
            // Load the service to resolve
            provider: 'IdProvider',
            // Create an object with service result
            draft: function($stateParams, user, provider) {
              // This promise has been resolved inside the Service
              return provider.get($stateParams.myId,user);
            },
        },
      })
      .state('logged.submission.step', {
        url: "/step/:stepId",
        views: {
          "singlestep": {
            templateUrl: 'submission/submission_allsteps_view.html',
            controller: 'StepController',
          },
        },
      })
/****************************************
/****************************************
/****************************************/

      .state('logged.adminsubmission', {
        url: "/configure/{myId:[0-9\-a-z]*}",
        views: {
          "contain": {
            templateUrl: 'submission/submission_admin_view.html',
            controller: 'SubmissionAdminController',
          },
        },
        onEnter: function($rootScope) {
          //$rootScope.$emit('rootScope:emit', 'gbgoff');
          $rootScope.$emit('rootScope:emit', 'editoff');
        },
      })
      .state('logged.adminsubmission.step', {
        url: "/step/:stepId",
        views: {
          "singlestep": {
            templateUrl: 'submission/submission_admin_step.html',
            controller: 'SubmissionAdminStepController',
          },
        },
      })
/****************************************
/****************************************
/****************************************/

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
        },
      })
      .state('logged.about', {
        url: "/about",
        views: { "contain": {
          templateUrl: "views/change.html",
          controller: 'NewsController',
        }, },
        onEnter: function($rootScope) {
          $rootScope.$emit('rootScope:emit', 'gbgoff');
          $rootScope.$emit('rootScope:emit', 'editon');
          $rootScope.lastVisited = undefined;
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
      console.log("Unknown", $location);
      // For a bug
      //http://stackoverflow.com/a/25755152/2114395
      var $state = $injector.get("$state");
      $state.go('notfound');
    }]);
    return true;
  });
});

// enable html5Mode for pushstate ('#'-less URLs)
//$locationProvider.html5Mode(true);