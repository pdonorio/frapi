
// Do something with the app about to run
// Need for configuration for some of my libraries
myApp.run(function(editableOptions)
{
    //console.log("app run");

    //Uhm: which is this library??
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});