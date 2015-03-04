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
    var params = {
        user: user,
        request_time: new Date(),
        published: 0,
    };
    return API.set(resource, params);
  }

  /*********************************
  ** CLASS *
  ******************************** */
  // Constructor, with class name
  function IdProvider(url) {
    this.id = defaultId;
    this.url = url;
  }
  IdProvider.prototype.getId = function (user) {
    console.log("Url", this.url);
    var response = defaultId;
    if (this.url == 'new')
        response = createId(user, this);
    return response;
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
  IdProvider.build = function (url) {
    // Create object
    return new IdProvider(url);
  }

  // Give this service to someone
  return IdProvider;
});
