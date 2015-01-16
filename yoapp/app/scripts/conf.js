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
  .constant('apiPort', '5507')
  .constant('apiFilePort', '5346')
  .constant('apiFileResource', 'uploads')
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
      $get: function ($location, apiPort, apiFilePort, apiFileResource)
      {

        //use location https://docs.angularjs.org/api/ng/service/$location
        var protocol = $location.protocol();
        var host = $location.host();
        var port = $location.port();
        config.apiBase = protocol + "://" + host + ":" + apiPort;
        config.apiFileBase = protocol + "://" + host + ":" + apiFilePort
          + "/" + apiFileResource;
        return config;
      }
    };
  });