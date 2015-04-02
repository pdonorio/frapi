'use strict';
/*
* Saved authentication cookie
*/

myApp
.factory('Auth', function ($cookies)
{


    var tmp = "empty";
    //Empty factory
    var Authentication = {};

    Authentication.set = function(user)
    {
        console.log("User", user);

        /* cookieStore deprecated!!!
        // http://stackoverflow.com/a/28854854/2114395
        **/
        // One day expiration
        var now = new Date(),
            exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        var cOptions = {
            secure: true,
            expires: exp,

            // NOT WORKING
            //domain: 'http://test.goo.devs',
            //path: '/login',
        };
        $cookies.put('someToken','blabla', cOptions);
        var cookie = $cookies.get('someToken');
        console.log("COOKIE", cookie); // logs 'blabla'

        return true;
    }

    Authentication.get = function() {
        console.log("Use cookies");
    }

    // Give this service to someone
    return Authentication;
});
