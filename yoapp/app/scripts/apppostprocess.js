'use strict';

// Do something with the app about to run
// Need for configuration for some of my libraries
myApp.run(function(editableOptions)
{
    //console.log("app run");

    // bootstrap3 theme. Can be also 'bs2', 'default'
    editableOptions.theme = 'bs3';
});