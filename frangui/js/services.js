/*

// Inject Restangular class to use Apis
myModule.factory('Api', function(Restangular)
{

      // All URLs on searches will use `http://google.com/` as the baseUrl
      var searches = Restangular.allUrl('searches', 'http://awesome.dev:5507/');
      searches.get().then(function(results) {
        console.log(results);
      });
      return {};

/*
    return {


      //####################################
      // GET data from API
      get: function() {

        return searches.get()
          .then(function(results) {
            console.log(results);
            return {};
            /*
            return {
              "status": 0,
              "message": "OK",
              "data": {}, //JSON.parse(result.data),
            };
          }

        )}

//# TO FIX - i should return some better standard for results,
//together with the api response (which must be improved)

/*
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

});
*/