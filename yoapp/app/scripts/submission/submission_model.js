'use strict';
/*
* Define the main object for the whole model of a Submission
*
* A StepList - editable by Admin
* A sets of StepTemplate - editable by Admin
* A sets of StepContent - editable by Editor
*/

myApp
.factory('Submission', function (StepList, StepTemplate, StepContent)
{

  /**
   * Constructor, with class name
   */
  function Submission(firstName, lastName, role, organisation) {
    // Public properties, assigned to the instance ('this')
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.organisation = organisation;
  }

  /**
   * Public method, assigned to prototype
   */
  Submission.prototype.getFullName = function () {
    return this.firstName + ' ' + this.lastName;
  };

  /**
   * Private property
   */
  var possibleRoles = ['admin', 'editor', 'guest'];

  /**
   * Private function
   */
  function checkRole(role) {
    return possibleRoles.indexOf(role) !== -1;
  }

  /**
   * Static property
   * Using copy to prevent modifications to private property
   */
  Submission.possibleRoles = angular.copy(possibleRoles);

  /**
   * Static method, assigned to class
   * Instance ('this') is not available in static context
   */
  Submission.build = function (data) {
    if (!checkRole(data.role)) {
      return;
    }
    return new Submission(
      data.first_name,
      data.last_name,
      data.role,
      //Organisation.build(data.organisation) // another model
      null
    );
  };

  Submission.apiResponseTransformer = function (responseData) {
    if (angular.isArray(responseData)) {
      return responseData
        .map(Submission.build)
        //.filter(Boolean)
        ;
    }
    return Submission.build(responseData);
  };

  /**
   * Return the constructor function
   */
  return Submission;
});
