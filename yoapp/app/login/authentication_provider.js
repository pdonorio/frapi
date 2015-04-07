'use strict';
/*
* Saved authentication cookie
*/

myApp
.factory('Auth', function ($cookies,
    COOKIEVAR_AUTHTOKEN, COOKIEVAR_USER, FAILED_TOKEN)
{
    var privateGetToken = function() {
        return $cookies.get(COOKIEVAR_AUTHTOKEN);
    }
    var privateGetUser = function() {
        return $cookies.get(COOKIEVAR_USER);
    }
    var privateCheckToken = function() {
        return privateGetToken() !== FAILED_TOKEN;
    }

    //Empty factory
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
// NOT WORKING ?
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
        //console.log("check 1", check1);
        var check2 = privateGetUser();
        //console.log("check 2", check2);
        return check1 && (check2 !== null);
    }

    // Username for query
    Authentication.getUser = function() {
        return privateGetUser();
    }

    // Give this service to someone
    return Authentication;
});
