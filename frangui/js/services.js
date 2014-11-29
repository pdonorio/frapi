
myModule.factory('Api', function($http)
{
    return {

      //####################################
      // GET data from API
      get: function() {

//# TO FIX - i should return some better standard for results,
//together with the api response (which must be improved)

        // Simple GET request example :
        return $http.get('http://awesome.dev:5507/data')
          .then(function(result) {
              //http is serializing my data, so parse Json before giving it back
              return {
                "status": 0,
                "message": "OK",
                "data": JSON.parse(result.data),
              };
           },
          //and what about errors?
            function(data) {
              // Handle error here
              //console.log(data);
              return {
                "status": data.status,
                "message": data.statusText,
                "data": {},
              }
            });


      }

      //####################################
      // POST data to API ?

    }
});