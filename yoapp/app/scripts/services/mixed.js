'use strict';

/**
 * @ngdoc service
 * @name yoApp.mixed
 * @description
 * # mixed
 * Provider in the yoApp.
 */
myApp.provider('mixed', function ()
{

    // Private variables
    var empty = {
      id: null,
      highlight: false,
      status: 0,  //no real status
      /* STATUS can be:
      0 - nothing
      1 - success
      2 - error
      3 - loading
      */
      content: '<span class="myred">Not defined yet</span>',
    };

    // Method for instantiating
    this.$get = function () {
      //return new Ingnition();

      return function(item, flag)
      {
        if (flag) {
          item = item || empty;
        }
        item.content = item.content || empty.content;
        return item;
      }

    };

/*  STANDARD DEFINITIONS in Provider
    var salutation = 'Hello';

    // Private constructor
    function Ingnition() {
      this.init = function () {
        return salutation;
      };
    }
    // Public API for configuration
    this.setSalutation = function (s) {
      salutation = s;
    };
*/
  });
