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
myApp.factory('DataResource', function(RestAPI, apiTimeout) {

    //Empty factory
    var Factory = {};

//TO FIX-
    //SHOULD DEFINE HERE the data as attribute of factory class...
    //this.currentData = [];
    //http://toddmotto.com/rethinking-angular-js-controllers/

    //###################################
    //A generic API GET
    Factory.get = function(resource, ppage, cpage) {

      //set resource for promise calling
      var api = RestAPI.all(resource);

      // Set parameters for my Api filters
      var params = {perpage: ppage, currentpage: cpage};
      var route = ''; //no sub routing as this is a "get all"

      // Make a promise for data call
      var promise = api
        .withHttpConfig({timeout: apiTimeout})  //set timeout
        //Address will be: "base url / resource / route "
        .doGET(route, params)
//TO FIX -
//MOVE TO WHERE IT'S CALLED
        .then( function(output) { //Success
            data = JSON.parse(output);
            //console.log(data);
            return data;
          }, function(object) { //Error (timeout?)
            console.log("Factory/Service api call Error: GET");
            console.log(object);
            return {};
          }
        );

      //Finished :)
      return promise;
    };

    //###################################
    //POST DATA
    Factory.set = function(resource, data) {

      var api = RestAPI.all(resource);
      var route = ''; //no route
      return api
        .withHttpConfig({timeout: apiTimeout*2}) //double timeout for Write
        .doPOST({}, route, data);  //put data
    }

    //###################################
    return (Factory);

});
