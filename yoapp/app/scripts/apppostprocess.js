'use strict';

// Do something with the app about to run
// Need for configuration for some of my libraries
myApp.run([
    //'$rootScope',
    'editableOptions',
    function(
    //$rootScope,
    editableOptions)
{
    //console.log("app run");

/* ROOT SCOPE WARNING
https://docs.angularjs.org/misc/faq
https://docs.angularjs.org/guide/scope

    // set some state inside root scope
    $rootScope.test = new Date();
    $rootScope.notification. = new Date();
*/


    // bootstrap3 theme. Can be also 'bs2', 'default'
    editableOptions.theme = 'bs3';
}]);