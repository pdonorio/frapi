'use strict';
/*
* Saved authentication cookie
*/

myApp
.factory('Auth', function ($cookies, COOKIEVAR_AUTHTOKEN, FAILED_TOKEN)
{
    var privateGetToken = function() {
        return $cookies.get(COOKIEVAR_AUTHTOKEN);
    }

    //Empty factory
    var Authentication = {};

    Authentication.set = function(token)
    {
        console.log("Setting token", token);
        if (!token)
            token = FAILED_TOKEN;

        // One day expiration
        var now = new Date(),
            exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        var cOptions = {
            secure: true, expires: exp,
            // NOT WORKING
            //domain: 'http://test.goo.devs', //path: '/login',
        };
        $cookies.put(COOKIEVAR_AUTHTOKEN, token, cOptions);
    }

    Authentication.checkAuth = function() {
        var token = privateGetToken();
        console.log("Token", token);
        if (token === FAILED_TOKEN) {
            return false;
        }
        console.log("LOGGED");
        return true;
    }

    // Give this service to someone
    return Authentication;
});
