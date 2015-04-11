'use strict';
/*
* accounting
*/
myApp
// For sha256 hashing
.constant('Crypto', window.CryptoJS)
// Real service
.factory('Account', function (Logger, $q, API, Crypto, AppConfig, Authentication)
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

  ////////////////////////////////////////////
  ////////////////////////////////////////////

  var isAdmin = function (role) {
    return role == AppConfig.userRoles.ADMIN_USER;
  }

  ////////////////////////////////////////////
  ////////////////////////////////////////////

  // Constructor, with class name
  function Account() {

    logger.debug("Creating user object");
    this.account = "null";
    this.status = {
        logged: false,
        roles: [],
    }

// TO FIX -
    // Resolve all promises here if you can

    // Should see if i have a cookie user and token
    this.account = Authentication.getUser();

    // If yes check if database has same user and token
    if (this.account !== "null") {
        logger.debug("Check user");
    }

    // Set now data for isLogged and isAdmin

  }

  ////////////////////////////////////////
  ////////////////////////////////////////
// TO FIX -
  Account.prototype.logIn = function (user) {
    $log.debug("");
/*
    var token = makeToken(user);
    Authentication.set(token, user.email);
    console.log("Saved");
*/
  }
  Account.prototype.logOut = function () {
    return Authentication.set(null, null);
  }
  Account.prototype.isLogged = function () {
    logger.debug('TOFIX','Am i logged?');
  }
  Account.prototype.isAdmin = function () { }

  ////////////////////////////////////////
  ////////////////////////////////////////

  ////////////////////////////////////////
  Account.prototype.set = function (user) {
    // Save inside db via API
    console.log("DB save user");
    saveUser(user);
  }

  ////////////////////////////////////////
  Account.prototype.get = function () {

// TO FIX - load from DB [with User model]
    this.role = 99;
    var admin = isAdmin(this.role);
    //loadUser(this.account);
    var user = {
        name: 'Baroque Admin',
        admin: admin,
    };

    return user;

  }

  ////////////////////////////////////////
// Please make sure i return a promise
  Account.prototype.check = function () {

    var obj = this;
    // Once logged
    return Authentication.checkAuth().then(function(check1) {
        // If authorized
        console.log("Verify auth");
        if (check1)
            return check1;
        // Otherwise i am here when logging first time
        console.log("Verify user", obj);
        return compareUserAgainstDB(obj.user).then(function(check2){
            return check2;
        });
    });
  }

  ////////////////////////////////////////
  // SERVICE RETURN
  return {
    getItem: function() {
        var user = new Account();
        return user;
    }
  }

});
