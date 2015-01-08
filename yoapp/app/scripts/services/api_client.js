
// Please PAOLO change the name of this file!!!
'use strict';

/**
// Inject Restangular class to use Apis
 */
myApp
  .factory('DataResource', function(Restangular, apiaddress, apiTimeout)
{

    //###################################
    //Empty factory
    var Factory = {};

    // All URLs on searches will use `http://google.com/` as the baseUrl
    var api = Restangular.allUrl('pyapi',apiaddress);

    //###################################
    //GET DATA - add method to factory
    Factory.get = function(resource, ppage, cpage) {

      // Set parameters for my Api filters
      var params = {perpage: ppage, currentpage: cpage};

      // Make a promise for data call
      var promise = api
        .withHttpConfig({timeout: apiTimeout})
        .doGET(resource, params)
        .then(
          //Success
          function(output) {
            data = JSON.parse(output);
            //console.log(data);
            return data;
          },
          //Error (timeout?)
          function(object) {
            console.log("Factory/Service api call Error: GET");
            console.log(object);
            return {};
          }
        );
      return promise;
    };

    //###################################
    //POST DATA
    Factory.set = function(resource, data) {
      console.log(resource);
      console.log(data);

      // Set parameters for my Api filters
      var row = {content: "test", element: 7, page: ""};

      // Make a promise for data call
      var promise = api
        .withHttpConfig({timeout: apiTimeout*2})
        .doPOST({name: "Message"}, resource, row, {})
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
