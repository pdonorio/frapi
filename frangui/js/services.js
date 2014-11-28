myModule.factory('Api', function() {

    var empty = false;

    return {

      //####################################
      // GET data from API
      get: function() {
        // Simple GET request example :
        $http.get('/data').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            return data;
          }).
          error(function(data, status, headers, config) {
            console.log(status);
            console.log(data);
            return data;

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      }

      //####################################
      // POST data to API ?

    }
});