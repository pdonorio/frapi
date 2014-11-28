myModule.factory('Api', function($http) {

    return {

      //####################################
      // GET data from API
      get: function() {

        var config = {
           url: 'http://awesome.dev:5507/data',
           method: 'GET',
           //params: 'limit=10, sort_by=created:desc',
           //headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
         };

        // Simple GET request example :
        $http(config).
          success(function(data, status, headers, config) {
            // called asynchronously when the response is available
            console.log(data);
            return data;
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            console.log(status);
            //console.log(data);
            return ["empty"];
          });
      }

      //####################################
      // POST data to API ?

    }
});