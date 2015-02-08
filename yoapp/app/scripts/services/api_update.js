'use strict';

// A separate object to hold any update
// before sending this to my API
myApp
.factory('DataUpdate', function () {

  // Create the class
  var FormData = function (label) {
    this.label = label;
  };

  // Prototypes
  FormData.prototype.foo = function () {
    console.log(this.label);
  };

  // New instance for each data updater
  return {
    getInstance: function (label) {
      return new FormData(label);
    }
  };

});