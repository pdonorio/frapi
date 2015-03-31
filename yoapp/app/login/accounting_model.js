'use strict';
/*
* accounting
*/

myApp
.constant('Crypto', window.CryptoJS)
.factory('Account', function (API, Crypto) {

  var resource = 'accounts';

  // Load data from API
  function verifyUser(req) {

    var parameters = { email: req.email };

    return API.get(resource, parameters)
      .then(function(response) {

          // Init check
          if (response.count != 1){
            console.log("User not found");
            delete(req.pw);
            return false;
          }
          if (!response.items[0].token){
            console.log("Item not available...");
            delete(req.pw);
            return false;
          }

          // Dirty moves
          var tmp = response.items[0];
          tmp.pw = req.pw;
          req.token = makeToken(tmp);
          delete(req.pw);
          tmp = {};

          // Final check
          if (response.items[0].token != req.token) {
            console.log("Wrong password");
            return false;
          }

          //console.log("Authorized");
          return true;

// IF WELL - request the token - with check api side...

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
    console.log("String token is ", mystring);
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
