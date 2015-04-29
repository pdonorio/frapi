
//ROUTING new
myApp
.config(function($stateProvider, $urlRouterProvider)
{
  // Set up the states and URL routing
  $stateProvider

    ////////////////////////////
    // Apply to any child
    .state('unlogged', {
      url: "/public",
      abstract: true,
      onEnter: function($window, AppConfig) {
        $window.mydomain = AppConfig.domain;
      },
      resolve: {
        cookie: function(Authentication) {
            return Authentication.get();
        },
        user: function(Account, cookie) {
            var userObj = Account.getItem(cookie);
            return userObj.get();
        }
      },
      views: { "main": {
        template: '<div ui-view="contain"></div>',
      }},
      data: {
        // this property will apply to all children of 'app'
        requireLogin: false,
      },
    })
    ////////////////////////////

    // For each page i didn't setup
    .state('unlogged.notfound', {
      url: "/404",
      views: { "contain": { templateUrl: "login/oops.html", }, },
    })

    // Static welcome page
    .state('unlogged.welcome', {
      url: "/static",
      views: {
        "contain": {
            templateUrl: "login/welcome.html",
            controller: 'MainController',
        },
      },
    })

    // Simple login logic
    .state('unlogged.dologin', {
      url: "/login/{status:[a-z]+}",
      views: {
        "contain": {
            templateUrl: "login/login.html",
            controller: "LoginController",
        },
      },
    })

    .state('unlogged.dologout', {
      url: "/logout",
      views: {
        "contain": {
          // Simple controller for logging out the account
          // note: resolve is no good for a state change //http://j.mp/1Fujv5n
          controller: function($state, user) {
            user.logOut();
            $state.go('unlogged.welcome'); // go to init page
          }
        }
      },
    })

///////////////////////////////////////////
// Once Logged
// Once Logged
    //The parent of all logged views
    .state('logged', {

      url: "/app",
      // Make this PARENT state abstract so it can never be
      // loaded directly
      abstract: true,
      data: {
        // this property will apply to all children of 'app'
        requireLogin: true,
      },

      views: {
        "main": {
            templateUrl: "views/app.html",
            //VERY IMPORTANT: controller have to be associated inside views
            //when using multiple views, NOT OUTSIDE
            controller: 'MainController',
            //this controller scope will be inherited from every nested child view
        },
      }, onEnter: function($rootScope, $state, $window, AppConfig) {
        $window.mydomain = AppConfig.domain;
        // Signal to remove background and add body pad for the topbar
        $rootScope.$emit('rootScope:emit', 'padon');
      }, onExit: function($rootScope){
        $rootScope.$emit('rootScope:emit', 'padoff');
      },
      // Set the current user for the whole application
      resolve: {
        cookie: function(Authentication) { return Authentication.get(); },
        user: function(Account, cookie, $state) {
            var userObj = Account.getItem(cookie);

            // AUTHENTICATION: First check on entering main
            //if ($state.data.requireLogin) {}
            return userObj.get().then(function(user){
                // if not...
                if (!user.isLogged()) {
                    console.log("Go away:",user);
                    $state.go('unlogged.dologin', {status: 'user'});
                }
                return user;
            });
        },
      },
    })

///////////////////////////////////////////////
    // LOGGED Child routes (sub view, nested inside parent)
      .state('logged.main', {
        url: "/main",
        data: { requireAdmin: false },
        views: {
          "contain": {
            templateUrl: "views/main.html",
          },
/*
 * To show search inside the home page
          "extra": {
            templateUrl: "views/datatable.html",
            controller: 'ViewController',
          },
*/
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

    ///////////////////////////////////////////////
      .state('logged.submission', {
        url: "/submission/{myId:[0-9\-a-z]*}",
        data: { requireAdmin: false },
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
/*
        resolve: {
            //docs: 'DocumentsFactory',
            docs: function(DocumentsFactory) {
                var tmp = DocumentsFactory.get();
                console.log("Resolve docs", tmp);
                return false;
            },
        },
*/
        views: {
          "singlestep": {
            templateUrl: 'submission/submission_allsteps_view.html',
            controller: 'StepController',
          },
        },
      })

    ///////////////////////////////////////////////
      .state('logged.adminsubmission', {
        url: "/configure/{myId:[0-9\-a-z]*}",
        data: { requireAdmin: true }, // Only for admins
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

    ///////////////////////////////////////////////
      .state('logged.search', {
        url: "/search",
        data: { requireAdmin: false },
        views: {
          "contain": {
            templateUrl: "views/datatable.html",
            controller: 'ViewController',
          },
        },
        onEnter: function($rootScope) {
          $rootScope.$emit('rootScope:emit', 'gbgon');
          $rootScope.edit.available = false;
          $rootScope.searching = undefined;
        },
      })
      .state('logged.view', {
        url: "/view/{myId:[0-9\-a-z]+}",
        data: { requireAdmin: false },
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
        data: { requireAdmin: false },
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
    ///////////////////////////////////////////////
      .state('logged.status', {
        url: "/plan",
        data: { requireAdmin: true },
        resolve: {
          userlist: function(Account) {
            return Account.getUserList();
          }
        },
        onEnter: function($rootScope) {
          // Avoid editing for now
          $rootScope.edit.available = false;
        },
        views: {
          "contain": {
            templateUrl: "tasks/view.html",
            controller: 'TaskController',
          }
        }
      })
// Once Logged
// Once Logged

////////////////////
  ; //routing end

////////////////////
  //Alias for no url?
  $urlRouterProvider.when('', '/public/static');

  // Redirect if unknown state
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $injector.invoke(['$state', function ($state) {

      // Log what happened
      var tmp = angular.copy($location);
      console.log("Unknown location:", tmp.$$absUrl);
      // For a bug
      //http://stackoverflow.com/a/25755152/2114395
      //var $state = $injector.get("$state");
      $state.go('unlogged.notfound');
    }]);
    return true;
  });
});

// enable html5Mode for pushstate ('#'-less URLs)
//$locationProvider.html5Mode(true);