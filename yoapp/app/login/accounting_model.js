'use strict';
/*
* accounting
*/
myApp

// For sha256 hashing
.constant('Crypto', window.CryptoJS)

// Real service
.factory('Account', function (
    // Secret/hidden authorizatino service
    $q, $cookies, COOKIEVAR_AUTHTOKEN, COOKIEVAR_USER, FAILED_TOKEN,
    // Normal part
    API, Crypto, AppConfig
    )
{

  ////////////////////////////////////////////
  ////////////////////////////////////////////

  // Authentication service is very private
  var privateGetUser = function() {
      return $cookies.get(COOKIEVAR_USER);
  }
  var privateCheckToken = function() {
      return $cookies.get(COOKIEVAR_AUTHTOKEN) !== FAILED_TOKEN;
  }
  // Handle cookie and authentication
  var Authentication = {};
  // Save cookie data at login time
  Authentication.set = function(token, username)
  {
      // If logout, token is null or undefined
      if (!token)
          token = FAILED_TOKEN;
// TO FIX - verify expiration
      // One day expiration
      var now = new Date(),
          exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var cOptions = {
          secure: true, expires: exp,
          //domain: 'http://test.goo.devs', //path: '/login',
      };
      // Save
      $cookies.put(COOKIEVAR_AUTHTOKEN, token, cOptions);
      console.log("setting username", username);
      $cookies.put(COOKIEVAR_USER, username, cOptions);
  }
  // To see if correctly logged
  Authentication.checkAuth = function() {
      var check1 = privateCheckToken();
      console.log("check 1", check1);
      var check2 = privateGetUser();
      console.log("check 2", check2);

      var response = check1 && (check2 !== null);

      // make a promise for compatibility with other checks
      var deferred = $q.defer();
      //deferred.notify('About to check');
      deferred.resolve(response);
      return deferred.promise;

  }
  // Username for query
  Authentication.getUser = function() {
      return privateGetUser();
  }

  ////////////////////////////////////////////
  ////////////////////////////////////////////

  var resource = 'accounts';
  function loadUser(user) {
    console.log("user", user);

// API CALL
// API CALL
// API CALL
  }

  // Load data from API
  function verifyUser(req) {

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
  function Account(user) {
    if (user) {
        this.account = user;
    } else {
        this.account = Authentication.getUser();
    }
    console.log("Creating Account", this.account);
  }

  ////////////////////////////////////////
// TO FIX -

// add login

// add logout

  ////////////////////////////////////////
  Account.prototype.logging = function (user) {

    if (!user)
        return Authentication.set(user, user);

    console.log("Save cookie user", user);
/*
    var token = makeToken(user);
    Authentication.set(token, user.email);
    console.log("Saved");
*/
  }

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
        return verifyUser(obj.user).then(function(check2){
            return check2;
        });
    });
  }


  ////////////////////////////////////////
  return Account;
});
