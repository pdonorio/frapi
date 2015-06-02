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
    factory.get = function(record) {
        var params = {recordid: record};

        return API.get(resource, params)
          .then(function(response) {
              var data = [];
              if (response.count > 0) {
                  logger.debug("Getting docs list");
                  data = response.items;
              }
              return data;
          });
    }

    factory.setTranscriptions = function(fileid, trs) {
        var params = {id: fileid};

        return API.get(resource,params).then(function(response) {

            if (response.count != 1) {
                logger.error("No document to update!");
                return false;
            }
            var data = response.items[0];

        //////////////////////////////////////////
            // HANDLING AN ARRAY!
            // EMPTY TRANSCRIPTIONS PROBLEM

            //console.log("Transcriptions", trs);

            // workaround after modification in API rdb handler
            if (trs.length < 1) {
                trs = [""];
            }

            data.transcriptions = trs;
            //data['transcriptions'] = trs;
        //////////////////////////////////////////

            // Do not update or it will fail
            delete data.upload_time;
            delete data.upload_user;

            //console.log("Data", data);
            return API.set(resource, data).then(function(response) {
                console.log("Updated", response);
                return true;
            });

        });
    }

    // Retrieve transcriptions for a single file
    factory.getTranscription = function(fileid) {
        var params = {id: fileid};

        return API.get(resource, params).then(function(response) {
          logger.debug("Getting transcriptions for file " + fileid);
          //console.log("Response", response);
          var data = [];
          if (response.count > 0)
              data = response.items[0];
          return data;
        });
    }

    // A new file is uploaded
    factory.unset = function(id, fname) {

        return API.del(resource, id).then(function() {
            logger.info("API removed: " + id);
            // Remove directories
            // File api has only one resource
            return API.removeFile(fname).then(function() {
                // Remove the document inside db via id
                logger.info("Also files deleted: " + fname);
                    return true;
            });
        });
    }

    // A new file is uploaded
    factory.set = function(id, file, type, user) {

        // Since python 'join path' uses underscore for spaces
        var myfile = file.replace(/[\s]/g, '_');

        var params = {
            code: myfile.replace(/\.[^\.]+$/, ''), // Remove extension
            filename: myfile,
            filetype: type,
            recordid: id,
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
