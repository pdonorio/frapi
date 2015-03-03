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
  function createId(user, obj) {

    //console.log("Creating new id for user "+user);
    var params = {
        user: user,
        request_time: new Date(),
        published: 0,
    };

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
        return createId(user, this).then(function(id){
            return id;
        });
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
