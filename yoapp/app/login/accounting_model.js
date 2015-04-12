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
  // Check data with API
  function compareUserAgainstDB(user, token) {

    var parameters = { email: user };

    return API.get(resource, parameters)
      .then(function(response) {

          // Init check
          if (!user)
            return "No user defined";
          if (response.count != 1)
            return "User not found";

          var usr = response.items[0];

          if (!usr.token)
            return "Service unavailable";
          // Password check
          if (usr.token != token)
            return "Wrong password";
          // Final check
          if (usr.activation < 1)
            return "Account not activated yet";
          // Authorized
          return usr;
      });
  }

  ////////////////////////////////////////
  // Register user
  function saveUser(data) {
    data.activation = 0;
    // All adminers....
    data.role = AppConfig.userRoles.ADMIN_USER;
    // send to database
    return API.set(resource, data)
      .then(function(id) {
          logger.log("Saved user: {0}", [id]);
          return id;
      });
  }

  ////////////////////////////////////////
  function makeToken(user) {
    var sep = '£';
    var salt = Crypto.SHA256(user.email).toString();
/*
    var salt = Crypto.SHA256(user.surname).toString();
    // var mystring = salt + user.surname + sep + user.name + sep
    //     + sep + user.pw + user.email;
*/

    // Only based on email and password
    var mystring = salt + user.email + sep + user.pw + user.email + sep;
    return Crypto.SHA256(mystring).toString();
  }

  ////////////////////////////////////////
  ////////////////////////////////////////

  var MyUser = function() {
    this.error = false;
    this.logged = false;
    this.role = AppConfig.userRoles.NO_ROLE;
  }
  MyUser.prototype.set = function (user) {

    if (user && user.pw) {
        user.token = makeToken(user.email, user.pw);
        delete user.pw;
    }
    this.user = user;
    logger.debug("Istance of User");
  }

  MyUser.prototype.logIn = function () {

    // Handle login
    var obj = this;
    console.log("TESTING LOGIN"); debugger;

    return compareUserAgainstDB(this.user.email, this.user.token)
        .then(function(response) {

        if (typeof response === 'object') {
            // Success
            obj.logged = true;
            obj.role = response.role;
            obj.name = response.name + " " + response.surname;
            console.log("Logged", obj);
/*
    // Cookie save last login
    if (Authentication.get() === false) {
        Authentication.set(this.user.token, this.user.email);
        logger.debug('debug', "Set data inside cookie", this.user.email);
    }
*/
        } else {
            // Failed
            obj.error = response;
            obj.logged = false;
        }
        return obj.logged;
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
    return saveUser(this.user);
  }

  ////////////////////////////////////////////
  ////////////////////////////////////////////

  // Constructor, with class name
  function Account(cookie) {
    logger.debug("Accounting");
    this.cookie = cookie;
    this.usr = new MyUser();
  }


// THIS 2 functions should be private and usable by user too

  ////////////////////////////////////////
  Account.prototype.get = function () {

    var obj = this.usr;

    // Should see if i have a cookie user and token
    if (this.cookie !== false) {
        logger.debug("Retrieve token from valid cookie");
        this.usr.set(this.cookie);
    }

    // This method has to be/solve a promise to work inside ui router resolve
    return this.usr.logIn().then(function(response){
        logger.warn("Login response: {0}", [response]);
        // Then act if valid with isLogged()
        return obj;
    });
  }

  ////////////////////////////////////////
  // SERVICE RETURN
  return {
    getItem: function(cookie) {
        return new Account(cookie);
    }
  }

});
