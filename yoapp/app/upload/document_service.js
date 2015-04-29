'use strict';
/*
* Handle all the documents stored inside the database

* what if the file does not exist but the entry is there?
*/

myApp
.factory('DocumentsFactory', function (API) {

    var resource = 'docs';
    var factory = {};

    // Retrieve file list
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

    // A new file is uploaded
    factory.set = function(file, user) {

        var params = {
            code: null,
            filename: file,
            upload_user: user,
            upload_time: Date.now(), //timestamp
            // no transcriptions in the beginning
        };

        // Save a new document and get the id
        return API.set(resource, params).then(function(id) {
            console.log("Uploaded new file inside db: " + id);
            return id;
        });
    }

    return factory;
});
