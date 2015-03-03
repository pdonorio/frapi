'use strict';
/*
* Provides for unique identifiers:
* if you need to create a draft
* or if you want to publish a document.
*
* Saves user and request_time as info
*/

myApp
.factory('IdProvider', function (API, $q)
{

  /*********************************
  ** PRIVATE *
  ******************************** */
  var resource = 'myidprovider';
  var defaultId = null;

  // Save data from API
  function createId(user, request_time, obj) {

    console.log("Creating new id for user "+user);
    var params = {user: user, date: request_time};

    return API.set(resource, params)
      .then(function(response) {
        // Response here is the id of inserted/updated element
        obj.setId(response);
        return response;
    }, function() {
        return defaultId;
    });
  }

  /*********************************
  ** CLASS *
  ******************************** */
  // Constructor, with class name
  function IdProvider() {
    this.id = defaultId;
  }
  IdProvider.prototype.getId = function (user) {
    // Not checking status here
    if (this.id === defaultId)
        return createId(user, new Date(), this).then(function(id){
            console.log("success"+id);
            return id;
        });
    console.log("ACCI");
    // return also if it's null
    var tmp = this.id;
    return $q(function(resolve) {
        resolve(tmp);
    });


  };
  IdProvider.prototype.setId = function (id) {
    this.id = id;
    console.log("Registered new id: " + this.id);
  }

  /*********************************
  ** CONTEXT *
  ******************************** */
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  IdProvider.build = function (step) {
    // Create object
    var obj = new IdProvider();
    // Send object
    return obj;
  }

  // Give this service to someone
  return IdProvider;
});
