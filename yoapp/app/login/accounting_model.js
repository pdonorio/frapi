'use strict';
/*
* accounting
*/
myApp
// For sha256 hashing
.constant('Crypto', window.CryptoJS)
// Real service
.factory('Account', function (Logger, $q, $timeout, API, Crypto, AppConfig, Authentication)
{
  var logger = Logger.getInstance('UserAccount');
  var resource = 'accounts';

  ////////////////////////////////////////
  function loadUser(user) {
    console.log("user", user);
// TO FIX -
// API CALL
  }

  ////////////////////////////////////////
  // Check data with API
  function compareUserAgainstDB(user, passw) {

    var parameters = { email: user };

    return API.get(resource, parameters)
      .then(function(response) {

          if (!user)
            return "No user";

          // Init check
          if (response.count != 1) 
            return "User not found";
          else if (!response.items[0].token) 
            return "Service unavailable";

          // Compute token
          var tmp = response.items[0];
          tmp.pw = passw;
          var token = makeToken(tmp);

          // Password check
          if (response.items[0].token != token)
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

  ////////////////////////////////////////
  // Register user
  function saveUser(data) {
    // Complete data
    data.token = makeToken(data);
    delete(data.pw);
// TO FIX - define roles?
    data.role = AppConfig.userRoles.ADMIN_USER;
    data.activation = 0;
    // send to database
    return API.set(resource, data)
      .then(function(id) {
          console.log("Saved user", id);
          return id;
      });
  }

  ////////////////////////////////////////
  function makeToken(user) {
    var sep = '£';
    var salt = Crypto.SHA256(user.surname).toString();
    var mystring = salt + user.surname + sep + user.name + sep
        + sep + user.pw + user.email;
    return Crypto.SHA256(mystring).toString();
  }

  ////////////////////////////////////////
  ////////////////////////////////////////
// TO FIX -

  var MyUser = function() {
    this.error = false;
    this.logged = false;
    this.admin = false;
    this.role = AppConfig.userRoles.NO_ROLE;
  }
  MyUser.prototype.set = function (user) {
    this.user = user;
  }

  MyUser.prototype.logIn = function () {
    Authentication.set(makeToken(this.user), this.user);
    logger.debug('debug', "Set data inside cookie", this.user);
    var obj = this;

    return compareUserAgainstDB(this.user.email, this.user.pw)
        .then(function(response) {

        console.log("Response is ", response);
        if (response === true) {

// TO FIX -
            // Retrieve data if valid
            //loadUser();
            console.log("UHM");

            // Set now data for isLogged and isAdmin ?
        } else {
            // Failed
            obj.error = response;
            return false;
        }
    });
  }

  MyUser.prototype.getError = function () {
    return this.error;
  }

  MyUser.prototype.logOut = function () {
    // Clean cookie
    Authentication.clean();

    // Return promise with reference to object
    var deferred = $q.defer();
    deferred.resolve(this);
    return deferred.promise;
  }
  MyUser.prototype.isLogged = function () {
    return this.logged;

  }
  MyUser.prototype.isAdmin = function () {
    return this.role == AppConfig.userRoles.ADMIN_USER;
  }

  MyUser.prototype.register = function () {
    // Save inside db via API
    console.log("DB save user");
    saveUser(user);
  }

  ////////////////////////////////////////////
  ////////////////////////////////////////////

  // Constructor, with class name
  function Account(cookie) {
    logger.debug("Creating user object");
    this.cookie = cookie;
    this.usr = new MyUser();
  }


// THIS 2 functions should be private and usable by user too

  ////////////////////////////////////////
  Account.prototype.get = function () {

    // Should see if i have a cookie user and token
    if (this.cookie === false) {
// LOGOUT
        return this.usr.logOut();
    } else {
// CHECK
        return this.usr.logIn();
    }

  }

  ////////////////////////////////////////
  // SERVICE RETURN
  return {
    getItem: function(cookie) {
        return new Account(cookie);
    }
  }

});
