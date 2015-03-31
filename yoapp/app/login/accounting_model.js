'use strict';
/*
* accounting
*/

myApp
.constant('Crypto', window.CryptoJS)
.factory('Account', function (API, Crypto) {

  var resource = 'accounts';

  // Load data from API
  function loadData(username) {
    console.log("Access with", user, token);
    var parameters = {
        //step: step,
    };
    return API.get(resource, parameters)
      .then(function(response) {
          var data = [];
          // Response should be one row in this case
          if (response.count > 0)
            data = response.items.pop();
          return data;
      });
  }

  // Register user
  function saveUser(data) {

// TO FIX - define roles?
    data.role = 999;
// TO FIX - IP, how to get?
    data.lastip = 123456789;
    // send to database
    return API.set(resource, data)
      .then(function(id) {
          console.log("Saved user", id);
          return id;
      });
  }

  function makeToken(user) {
    var sep = '£';
    var salt = Crypto.SHA256(user.surname).toString();
    var mystring = salt + user.surname + sep + user.name + sep
        + sep + user.pw + user.email;
    return Crypto.SHA256(mystring).toString();
  }

  /*********************************
  ** CLASS *
  ******************************** */
  // Constructor, with class name
  function Account(user) {
    user.token = makeToken(user);
    delete(user.pw);
    this.user = user;
  }
  // Public methods, assigned to prototype
  Account.prototype.set = function () {
    return saveUser(this.user);
  }
  Account.prototype.get = function () {
    console.log("Set session?");
  }

  /*********************************
  ** CONTEXT *
  ******************************** */
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  Account.build = function (user)
  {
    // Create object
    return new Account(user);
  }
  // Give this service to someone
  return Account;

});
