'use strict';
/*
* Auth: token and cookies
*/
myApp

.factory('Authentication',
    function (Logger, $q, $cookies, AppConfig,
        COOKIEVAR_AUTHTOKEN, COOKIEVAR_USER, FAILED_TOKEN, FAILED_USER)
{

  //https://github.com/naorye/angular-ny-logger
  var logger = Logger.getInstance('UserAuth');
/*
  logger.log('This is a log');
  logger.warn('warn', 'This is a warn');
  logger.error('This is a {0} error! {1}', [ 'big', 'just kidding' ]);
  logger.debug('debug', 'This is a debug for line {0}', [ 8 ]);
*/

  var checkAuth = function(user, token) {
      var checkUser = typeof user !== 'undefined' && user !== FAILED_USER;
      var checkToken = typeof token !== 'undefined' && token !== FAILED_TOKEN;
      var response = checkUser && checkToken;
      logger.debug("Checking cookie", response);
      return response;
  }

  // Handle cookie and authentication
  var Authentication = {};

  // Operation to clean cookie
  Authentication.clean = function() {
    this.set(null,null);
  }

  // Save cookie data at login time
  Authentication.set = function(token, username)
  {
      // If logout, token is null or undefined
      if (!token || !username) {
          token = FAILED_TOKEN;
          username = FAILED_USER;
      }
      // days of expiration
      var   days = 30,
            now = new Date(),
            exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);

      // Depends on https
      var securing = false;
      if (AppConfig.currentProtocol == 'https')
        securing = true;

      var cOptions = {
          secure: securing,
          expires: exp,
          //domain: 'http://test.goo.devs', //path: '/login',
      };
      // Save
      $cookies.put(COOKIEVAR_USER, username, cOptions);
      // Only token will expire in one da
      cOptions.expires = exp;
      $cookies.put(COOKIEVAR_AUTHTOKEN, token, cOptions);
      logger.log("Saved new cookie, expiring in days " + days);
  }

  Authentication.get = function() {
      var username = $cookies.get(COOKIEVAR_USER);
      //console.log("Get User", username);
      var token = $cookies.get(COOKIEVAR_AUTHTOKEN);
      //console.log("Get Token", token);
      if (checkAuth(username, token))
        return {email: username, token: token};
      return false;
  }

  return Authentication;

});