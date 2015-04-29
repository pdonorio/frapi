'use strict';
/*
* Handle all the documents stored inside the database

* what if the file does not exist but the entry is there?
*/

myApp
.factory('DocumentsFactory', function (API) {

    var resource = 'docs';
    var factory = {};

    factory.get = function() {
        return API.get(resource)
          .then(function(response) {
              console.log("Getting docs");
              var data = [];
              if (response.count > 0)
                  data = response.items;
              return data;
          });
    }
    return factory;

});
