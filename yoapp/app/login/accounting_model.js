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
  function loadUserIfValid(user, token, obj) {

    var parameters = { email: user };
    var res = {status: false, error: "No cookie defined"};

    return API.get(resource, parameters)
      .then(function(response) {

          // Init check
          if (!user)
            return res;
          //console.log(response);
          if (response.status)
            res.error = "Database unreachable [offline]";
          else if (response.count != 1)
            res.error =  "User not found";
          else {
            var usr = response.items[0];
            if (!usr.token)
              res.error =  "Service unavailable";
            // Password check
            else if (usr.token != token)
              res.error =  "Wrong password";
            // Final check
            else if (usr.activation < 1)
              res.error =  "Account not activated yet";
            // Authorized
            else {
              logger.log("Obtained user", usr);
              res.data = usr;
              res.status = true;
            }
          }
          //console.log("Obj", res);
          return res;

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

/*  this was better
    var salt = Crypto.SHA256(user.surname).toString();
    // var mystring = salt + user.surname + sep + user.name + sep
    //     + sep + user.pw + user.email;
*/

    // Only based on email and password
    var salt = Crypto.SHA256(user.email).toString();
    var mystring = salt + user.email + sep + user.pw + user.email + sep;

    // Make a string out of Crypto module
    return Crypto.SHA256(mystring).toString();
  }

  ////////////////////////////////////////
  ////////////////////////////////////////

  var MyUser = function() {
    this.error = false;
    this.logged = false;
    this.role = AppConfig.userRoles.NO_ROLE;
    this.name = null;
    this.user = {email: null, token: null};
  }
  MyUser.prototype.set = function (user) {

    // Compute Token
    if (user && user.pw) {
        user.token = makeToken(user);
        //console.log("token", user.token);
        delete user.pw;
    }
    logger.debug("Istance of User", user);

    // Set cookie/user inside MyUser object
    this.user = {email: null, token: null};
    if (user && user.email)
        this.user = user;
  }

  MyUser.prototype.logIn = function (force) {

    var ref = this;

//THE PROBLEM
    // The promise
    return loadUserIfValid(this.user.email, this.user.token).then(function(res){

        // Am i logged?
        ref.logged = res.status;
        ref.error = !res.status;

        // If i have nothing inside the cookie and received valid credential
        if (res.status) {

            // Cookie save last login, only at login time
            if (force)
                Authentication.set(ref.user.token, ref.user.email);

// TO FIX
            // Save what i need
            //var identifier = null;
            var identifier = 0;
            if (res.data.id)
                identifier = res.data.id.substr(0, 8);
            else
                logger.warn("Could not get identifier for current user");

            ref.name = res.data.name + " " + res.data.surname;
            ref.role = res.data.role;
            ref.myid = identifier;
        } else {
            ref.error = res.error;
        }

        return ref;
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

    // Should see if i have a cookie user and token
    if (this.cookie !== false) {
        logger.debug("Retrieve token from valid cookie");
        this.usr.set(this.cookie);
    }
    return this.usr.logIn();
  }

  ////////////////////////////////////////
  // SERVICE RETURN
  return {
    getItem: function(cookie) {
        return new Account(cookie);
    }
  }

});
