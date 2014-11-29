myModule.factory('Api', function($http) {

    return {

      //####################################
      // GET data from API
      get: function() {

        // Simple GET request example :
        return $http.get('http://awesome.dev:5507/data')
          .then(function(result) {
              //http is serializing my data, so parse Json before giving it back
             return JSON.parse(result.data);
           });

          //WHAT ABOUT ERRORS?
      }

      //####################################
      // POST data to API ?

    }
});