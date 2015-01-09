'use strict';

// Global Restangular configuration
myApp.config(function(RestangularProvider, apiaddress) {
  //i will use the same base url for all my api requests
  RestangularProvider.setBaseUrl(apiaddress);
});

/**
// Inject Restangular class to use Apis
 */
myApp
  .factory('DataResource', function(Restangular, apiTimeout)
{
    //Empty factory
    var Factory = {};

    //###################################
    //A generic API GET
    Factory.get = function(resource, ppage, cpage) {

      //set resource for promise calling
      var api = Restangular.all(resource);

      // Set parameters for my Api filters
      var params = {perpage: ppage, currentpage: cpage};
      var route = ''; //no sub routing as this is a "get all"

      // Make a promise for data call
      var promise = api
        .withHttpConfig({timeout: apiTimeout})  //set timeout
        //Address will be: "base url / resource / route "
        .doGET(route, params)
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
      console.log(data);

      var api = Restangular.all(resource);
      var route = '';
      var promise = api
        //double timeout for Write
        .withHttpConfig({timeout: apiTimeout*2})
        .doPOST({}, route, data)  //put data
        .then(function() {
            console.log("Object saved OK");
          }, function() {
            console.log("Factory/Service api call Error: POST");
          }
        );
      return promise;
    }

    //###################################
    return (Factory);

});
