'use strict';

myApp
.factory('StepService', function (API, StepList) {
  return {
    getList: function () {
      return API.get('steps').then(StepList.apiResponseTransformer);
    }
  };
})
/*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

.factory('StepList', function ()
{

  /** * Constructor, with class name */
  function StepList(data) {
    this.tmp = data;
    console.log(this.tmp);
  }
  /** * Static method, assigned to class
   * Instance ('this') is not available in static context */
  StepList.build = function (data) {
    //if (!checkList(data.items)) { return; }
    return new StepList(data);
  }

  /** * Use api response to enable data */
  StepList.apiResponseTransformer = function (responseData) {
    console.log("Transformer StepList");
    if (angular.isArray(responseData)) {
      return responseData
        .map(StepList.build)
        //.filter(Boolean)
        ;
    }
    return StepList.build(responseData);
  };

  return StepList;

});