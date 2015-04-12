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

  function loadUser(user) {
    console.log("user", user);
// TO FIX -
// API CALL
  }

  // Load data from API
  function compareUserAgainstDB(req) {

    var email = null;
    if (req && req.email)
        email = req.email;
    var parameters = { email: email };

    return API.get(resource, parameters)
      .then(function(response) {

          if (!req)
            return "No user";

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
    data.role = AppConfig.userRoles.ADMIN_USER;
    data.activation = 0;
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

  ////////////////////////////////////////
  ////////////////////////////////////////
// TO FIX -

  var MyUser = function() {
    this.logged = false;
    this.admin = false;
    this.role = AppConfig.userRoles.NO_ROLE;
  }
  MyUser.prototype.set = function (user) {
    this.user = user;
    // Load from db if valid
    //loadUser();
  }

  MyUser.prototype.logIn = function (user) {
    $log.debug("Set data inside cookie?");
    // var token = makeToken(user);
    // Authentication.set(token, user.email);
    // console.log("Saved");
  }
  MyUser.prototype.logOut = function () {
    return Authentication.set(null, null);
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

  ////////////////////////////////////////
  Account.prototype.get = function () {

    // Should see if i have a cookie user and token
    if (this.cookie === false) {
        var deferred = $q.defer();
        this.usr.set();
        deferred.resolve(this.usr);
        return deferred.promise;
    } else {
        console.log("Compare with db");
        //compareUserAgainstDB(obj.user).then(function(check2){

        // Set now data for isLogged and isAdmin
        return true;
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
