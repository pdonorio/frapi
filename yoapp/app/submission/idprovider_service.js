'use strict';
/*
* Provides for unique identifiers:
* if you need to create a draft
* or if you want to publish a document.
*
* Saves user and request_time as info
*/

myApp
.factory('IdProvider', function (API) {

    var resource = 'myidprovider';
    //Empty factory
    var Factory = {};
    var defaultId = null;

    Factory.get = function(url, user) {
        var response = defaultId;
        if (url == 'new') {
            var params = {
                user: user,
                request_time: new Date(),
                published: 0,
            };
            // Save a new document and get the id
            response = API.set(resource, params).then(function(id) {
                console.log("Registered new id: " + id);
                return id;
            });
        }
        return response;
    }

    // Give this service to someone
    return Factory;
});
