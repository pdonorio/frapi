'use strict';
/*
* Auth: token and cookies
*/
myApp

.factory('Authentication',
    function (Logger, $q, $cookies,
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

  // Handle cookie and authentication
  var Authentication = {};

  // Save cookie data at login time
  Authentication.set = function(token, username)
  {
      // If logout, token is null or undefined
      if (!token || !username) {
          token = FAILED_TOKEN;
          username = FAILED_USER;
      }
      // One day expiration
      var now = new Date(),
          exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var cOptions = {
// TO FIX - verify expiration
          secure: true, expires: exp,
          //domain: 'http://test.goo.devs', //path: '/login',
      };
      // Save
      $cookies.put(COOKIEVAR_AUTHTOKEN, token, cOptions);
      $cookies.put(COOKIEVAR_USER, username, cOptions);
      logger.log("Saved cookies [token, user]")
  }
  // To see if correctly logged
  Authentication.checkAuth = function() {
      var checkUser = $cookies.get(COOKIEVAR_USER) !== FAILED_USER;
      var checkToken = $cookies.get(COOKIEVAR_AUTHTOKEN) !== FAILED_TOKEN;
      return checkUser && checkToken;
  }

  return Authentication;

});