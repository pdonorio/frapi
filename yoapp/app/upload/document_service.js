'use strict';
/*
* Handle all the documents stored inside the database

* what if the file does not exist but the entry is there?
*/

myApp
.factory('DocumentsFactory', function (API) {

    var factory = {};

    factory.get = function() {
        console.log("The factory");
        return true;
    }
    return factory;

});
