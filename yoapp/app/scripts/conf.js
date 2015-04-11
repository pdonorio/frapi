'use strict';

/**
 * @ngdoc overview
 * @name AppConfig
 * @description
 * # AppConfig
 *
 * Config module of the application.
 */

angular.module('AppConfig', [])

  //API
  .constant('apiPort', '5507')
  .constant('apiBase', '/api/v1.0')
  .constant('apiFilePort', '5346')
  .constant('apiFileResource', 'uploads')

  //USERS
  .constant('USER_ROLES',{
    ADMIN_USER: 99,
    OPERATOR_USER: 11,
    GUEST_USER: 2,
  })

  // Minimum timeout to get objects working inside directive....
  // I DON'T LIKE THIS
  .constant('directiveDataTimeout', 150)
  .constant('directiveTimeout', 10)

  //Notification status
  .constant('messageStatus', {
    none: 0,
    loading: 1,
    success: 2,
    warning: 3,
    error: 4
  })

  // config module has provider with same name
  .provider('AppConfig', function () {

    // initial / default config
    var config = {
      empty: null,
      apiBase: null,
    };

    //the trick to use location inside config
    //https://github.com/angular/angular.js/issues/1452
    this.$inject=['$location'];

    //save in a variable the path to API
    return {
      $get: function ($location, apiBase, apiPort, apiFilePort, apiFileResource, messageStatus, USER_ROLES)
      {

        //use location https://docs.angularjs.org/api/ng/service/$location
        var host = $location.host();
        var port = $location.port();

// TO FIX -
// https only for sending informations, not files, at the moment
        protocol = "http";
        config.apiFileBase = protocol + "://" + host + ":" + apiFilePort
          + "/" + apiFileResource;

        var protocol = $location.protocol();
        config.apiBase = protocol + "://" + host + ":" + apiPort + apiBase;

        //notification messages status
        config.messageStatus = messageStatus;

        // Roles
        config.userRoles = USER_ROLES;

        return config;
      }
    };
  });