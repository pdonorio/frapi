'use strict';
/*
* accounting
*/

myApp
.constant('Crypto', window.CryptoJS)
.factory('Account', function (API, Crypto) {

  var resource = 'accounts';

  function loadUser(user) {
    console.log("user", user);

// API CALL
// API CALL
// API CALL
  }

  // Load data from API
  function verifyUser(req) {

    var parameters = { email: req.email };

    return API.get(resource, parameters)
      .then(function(response) {

          // Init check
          if (response.count != 1) {
            delete(req.pw);
            return "User not found";
          } else if (!response.items[0].token) {
            delete(req.pw);
            return "Service unavailable";
          }

          // Dirty moves
          var tmp = response.items[0];
          tmp.pw = req.pw;
          // Compute token
          req.token = makeToken(tmp);
          delete(req.pw);

          // Password check
          if (response.items[0].token != req.token)
            return "Wrong password";
          // Final check
          if (tmp.activation < 1)
            return "Account not activated yet";

          // Authorized
          return true;

// TO FIX -
    // if all is fine: request the token - with check api side...

      });
  }

  // Register user
  function saveUser(data) {

    // Complete data
    data.token = makeToken(data);
    delete(data.pw);
// TO FIX - define roles?
    data.role = 999;
    data.activation = 0;
    // send to database
    return API.set(resource, data)
      .then(function(id) {
          //console.log("Saved user", id);
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
    this.user = user;
  }
  // Public methods, assigned to prototype
  Account.prototype.set = function () {
    return saveUser(this.user);
  }
  Account.prototype.get = function () {
    loadUser(this.user);
  }
  Account.prototype.check = function () {
    console.log("Verify");
    return verifyUser(this.user);
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
