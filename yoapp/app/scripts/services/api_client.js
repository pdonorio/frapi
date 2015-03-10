'use strict';

// Restangular service definition
myApp.factory('RestAPI', function(Restangular, AppConfig)
{
  return Restangular.withConfig(function(RestangularConfigurer) {
    //i will use the same base url for all my api requests
    RestangularConfigurer.setBaseUrl(AppConfig.apiBase);

  });
});

// Inject my Restangular class to create a factory/service that uses my API
myApp.factory('API', function(RestAPI, apiTimeout, currentpageDefault, perpageDefault)
{

    //Empty factory
    var Factory = {};

//TO FIX-
    //SHOULD DEFINE HERE the data as attribute of factory class...
    //this.currentData = [];
    //http://toddmotto.com/rethinking-angular-js-controllers/

    //###################################
    //A generic API GET
    Factory.get = function(resource, parameters) {

      //set resource for promise calling
      var api = RestAPI.all(resource);

      if (!parameters)
        parameters = {}

      /////////////////////////////////////////
      //Warning: if data is coming from input
      //we must convert string to integer (just in case)
      if (parameters.perpage)
        parameters.perpage = parseInt(parameters.perpage);
      else parameters.perpage = NaN;
      if (isNaN(parameters.perpage))
        parameters.perpage = perpageDefault;

      if (parameters.currentpage)
          parameters.currentpage = parseInt(parameters.currentpage);
      else parameters.currentpage = NaN;
      if (isNaN(parameters.currentpage))
        parameters.currentpage = currentpageDefault;
      //console.log(perpage);

      // Check other parameters??
      // foreach parameters


      var route = ''; //no sub routing as this is a "get all"

      // Make a promise for data call
      var promise = api
        .withHttpConfig({timeout: apiTimeout})  //set timeout
        //Address will be: "base url / resource / route "
        .doGET(route, parameters)
        .then( function(output) { //Success
            data = JSON.parse(output);
            //console.log(data);
            return data;
          }, function(object) { //Error (timeout?)
            console.log("Factory/Service api call Error: GET");
            console.log(object);
            return {whoami: 'api error message', status: 'failed', msg: null};
          }
        );

      //Finished :)
      return promise;
    };

    //###################################
    //DELETE DATA
    Factory.unset = function(resource, data) {
      var api = RestAPI.all(resource);
      var route = ''; //no route
      return api
        .withHttpConfig({timeout: apiTimeout})
        .doDELETE({}, route, data); //, {}, headers);  //put data
    }

    //###################################
    //POST DATA
    Factory.set = function(resource, data) {

      var api = RestAPI.all(resource);
      var route = ''; //no route

      //post(subElement, elementToPost, [queryParams, headers])
      //customPOST([elem, path, params, headers])

      return api
        .withHttpConfig({timeout: apiTimeout*2}) //double timeout for Write
        .doPOST({}, route, data); //, {}, headers);  //put data
    }

    //###################################
    return (Factory);

});
