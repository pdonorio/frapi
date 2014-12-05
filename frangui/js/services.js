// Inject Restangular class to use Apis
myModule.factory('DataResource', function(Restangular) {

    //###################################
    //Empty factory
    var Factory = {};

    // All URLs on searches will use `http://google.com/` as the baseUrl
    var api = Restangular.allUrl('pyapi','http://awesome.dev:5507');

    //###################################
    //GET DATA
    Factory.get = function(resource) {

      //console.log(resource);

      // Make a promise for data call
      promise = api.customGET(resource)
        .then(
          //Success
          function(output) {
            data = JSON.parse(output);
            //console.log(data);
            return data;
          },
          //Error
          function(object) {
            console.log("Factory/Service api call Error");
            console.log(object);
          }
        );
      return promise;

    };

    //###################################
    return (Factory);

});