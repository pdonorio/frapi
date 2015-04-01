'use strict';
/*
* Saved authentication cookie
*/

myApp
.factory('Auth', function ($cookies, $cookieStore)
{

    var tmp = "empty";
    //Empty factory
    var Authentication = {};

    Authentication.set = function(user)
    {
        console.log("User", user);
        return true;
    }

    Authentication.get = function()
    {
        console.log("Use cookies");
    }

    // Give this service to someone
    return Authentication;
});
