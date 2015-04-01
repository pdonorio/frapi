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
        var now = new Date(), // this will set the expiration to 6 months
            exp = new Date(now.getFullYear(), now.getMonth()+6, now.getDate());
        $cookies.put('someToken','blabla',{ expires: exp });
        var cookie = $cookies.get('someToken');
        console.log(cookie); // logs 'blabla'

        return true;
    }

    Authentication.get = function() {
        console.log("Use cookies");
    }

    // Give this service to someone
    return Authentication;
});
