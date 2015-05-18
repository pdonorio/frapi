'use strict';

// Restangular service definition
myApp.factory('RestAPI', function(Restangular, AppConfig)
{
  return Restangular.withConfig(function(RestangularConfigurer) {
    //i will use the same base url for all my api requests
    RestangularConfigurer.setBaseUrl(AppConfig.apiBase);

  });
});
myApp.factory('RestFileAPI', function(Restangular, AppConfig)
{
  return Restangular.withConfig(function(RestangularConfigurer) {
    //i will use the same base url for all my api requests
    RestangularConfigurer.setBaseUrl(AppConfig.apiFileBase);

  });
});

// Inject my Restangular class to create a factory/service that uses my API
myApp.factory('API', function(RestAPI, RestFileAPI, apiTimeout,
    currentpageDefault, perpageDefault)
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
      /////////////////////////////////////////


      var route = ''; //no sub routing as this is a "get all"

      // Make a promise for data call
      var promise = api
        .withHttpConfig({timeout: apiTimeout})  //set timeout
        //Address will be: "base url / resource / route "
        .doGET(route, parameters)

// TO FIX -
// SHOULD USE success and error?
// http://farazdagi.com/talks/2014-06-dpc/#11

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
    Factory.del = function(resource, id) {
      // Check id
      if (!id) {
        console.log("Trying to delete no rows");
        return false;
      }
      // Use resource
      resource += "/" + id;
      var api = RestAPI.all(resource);
      return api
        .withHttpConfig({timeout: apiTimeout})
        .doDELETE();
    }

    //###################################
    //FILE: remove
    Factory.removeFile = function(filename) {

      // Check file
      if (!filename) {
        console.log("Trying to delete no file");
        return false;
      }

      var api = RestFileAPI.all(filename);
      return api
        .withHttpConfig({timeout: apiTimeout})
        .doDELETE();
    }

    //###################################
    //POST DATA
    Factory.set = function(resource, data) {

      var api = RestAPI.all(resource);
      var route = ''; //no route

      //console.log("data", data);
      //post(subElement, elementToPost, [queryParams, headers])
      //customPOST([elem, path, params, headers])

      return api
        .withHttpConfig({timeout: apiTimeout*2}) //double timeout for Write
        .doPOST({}, route, data); //, {}, headers);  //put data
    }

    //###################################
    return (Factory);

});
