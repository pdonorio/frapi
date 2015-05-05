'use strict';
/*
* Handle all the documents stored inside the database

* what if the file does not exist but the entry is there?
*/

myApp
.factory('DocumentsFactory', function (API, Logger) {

    var resource = 'docs';
    var factory = {};
    var logger = Logger.getInstance('docs');

    // Retrieve file list
    factory.get = function() {
        return API.get(resource)
          .then(function(response) {
              logger.debug("Getting docs list");
              var data = [];
              if (response.count > 0)
                  data = response.items;
              return data;
          });
    }

//factory.setTranscription = function(transcription) {

    // Retrieve transcriptions for a single file
    factory.getTranscription = function(fileid) {
        var params = {id: fileid};

        return API.get(resource)
          .then(function(response) {
              logger.debug("Getting transcriptions for file " + fileid);
              var data = [];
              if (response.count > 0)
                  data = response.items;
              return data;
          });
    }

    // A new file is uploaded
    factory.set = function(file, type, user) {

        var params = {
            code: null,
            filename: file,
            filetype: type,
            upload_user: user,
            upload_time: Date.now(), //timestamp
            // no transcriptions in the beginning
        };

        // Save a new document and get the id
        return API.set(resource, params).then(function(id) {
            logger.info("Uploaded new file inside db: " + id);
            return factory.get();
        });
    }

    return factory;
});
