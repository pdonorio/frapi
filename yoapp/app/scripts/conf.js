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
  .constant('apiPort', '80')
  .constant('apiBase', '/api/v1')

  //USERS
  .constant('USER_ROLES',{
    ADMIN_USER: 999,
    OPERATOR_USER: 11,
    GUEST_USER: 2,
    NO_ROLE: -1,
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
      $get: function ($location, apiBase, apiPort, messageStatus, USER_ROLES)
      {

        // What to do with this?
        config.debug = true;

        //use location https://docs.angularjs.org/api/ng/service/$location
        var host = $location.host();
        var port = $location.port();
        var protocol = $location.protocol();
        //console.log("Procotol", protocol);

        var baseAddress = protocol + "://" + host;
        if (protocol != 'https')
            baseAddress += ":" + apiPort
        config.apiBase = baseAddress + apiBase;

        // Protocol
        config.currentProtocol = protocol;
        config.domain = host;

        // notification messages status
        config.messageStatus = messageStatus;

        // Roles
        config.userRoles = USER_ROLES;

        return config;
      }
    };
  });