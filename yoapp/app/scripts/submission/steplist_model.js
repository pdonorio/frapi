'use strict';

/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('StepList', function (API) {

  var resource = 'steps';

// No, you can transform the result just fine by using a .then() handler inside the service. That's how promises are supposed to be used.

  // API resolve data
  function loadData() {
    return API.get(resource)
      .then(function(response) {
          var data = [];
          if (response.count > 0) {
              var tmp = response.items; //tmp.sort();

              // Js foreach cycle: to create my array out of RDB json
              tmp.forEach(function(element, index) {
                data[element.step] = element.label;
              });
          }
          return data;
      });
  }

  // API try to save data
  function saveData(data) {
/*
    //API CALL
    API.set(resource, data).then(function() {
        msg = "Saved content<br> <div class='well'>"+ $scope.item.content +"</div>";
        NotificationData.setNotification(AppConfig.messageStatus.success, msg);
    }, function() {
        msg = "Could not save steps editing<br> " +
        "<br> <br> Please try again in a few minutes." + "";
        NotificationData.setNotification(AppConfig.messageStatus.error, msg);
    });
*/
  }

  // Constructor, with class name
  function StepList(data) {
    this.tmp = data;
  }
  // Public methods, assigned to prototype
  StepList.prototype.getData = function () {
    return this.tmp;
  };
  // Static method, assigned to class
  // p.s. Instance ('this') is not available in static context
  StepList.build = function (data) {
    // API call
    var data = loadData();
    // Create object
    return new StepList(data);
  }

  // Give this service to someone
  return StepList;
})
