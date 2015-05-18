'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ViewController
 * @description
 * # ViewController
 * Controller of the yoApp
 */

myApp
 .controller('ViewController', function ($scope, $rootScope, API, StepContent, perpageDefault, currentpageDefault, focus)
{

    // Init: Html scope data
    $scope.datacount = 0;
    $scope.from = 0;
    $scope.data = {};
    $scope.headers = [ "Documento", "Contenuto", "Azioni" ];
    $scope.perpage = perpageDefault;
    $scope.currentpage = currentpageDefault;

    // Closed advanced search
    $scope.isCollapsed = true;

    // What to do on focus
    $scope.doFocus = function () {
      $scope.mytable.show = true;
      $rootScope.searching = true;
      $rootScope.edit.available = false;
    }

    // Put focus on the first search bar
    focus("search");

  /* ************************************
  ***************************************
   TYPEAHEAD
  ***************************************
  ************************************* */

    $scope.selected = undefined;
    $scope.search = function()
    {
      console.log("Searching: " + $scope.selected);

// TO FIX -
      //should check if this value has already been requested

      //1. Skip if equal to latest
      //2. Cache?
    }
    $scope.onTypeaheadSelect = function (item, model, label)
    {
      $scope.search(item);
      // console.log("Item "+item);
      // console.log("Model "+model);
      // console.log("Label "+label);
    }

    $scope.typeahead = {
      data: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    };


  /* ************************************
  ***************************************
   Refresh datatable from API call
  ***************************************
  ************************************* */
    var resource = 'stepscontent';
    var userresource = 'accounts';

    //Bind data in html to function
    $scope.reloadTable = function(perpage, currentpage)
    {

      // Get the data (as a promise)
      var params = {perpage: perpage, currentpage: currentpage};

// TO FIX - use userlist inside resolve
      // GET USERS list
      API.get(userresource).then(function(res)
      {

          var users = {};
          res.items.forEach(function(obj, key){
            var hash = obj.id.substr(0, 8);
            users[hash] = obj.name + obj.surname.substr(0, 1);
          });
          //console.log("Users", users);

// TO FIX - use StepContent
          // Get raw content...
          API.get(resource, params).then(function(data) {

                var documents = {}
                var hashes = {};

                data.items.forEach(function(el, key){

                  // Create record
                  if (!hashes[el.recordid]) {
                    // hashes
                    hashes[el.recordid] = true;
                    // Current element
                    documents[el.recordid] =
                    {
                        ts: el.latest_timestamp,
                        user: users[el.user],
                        steps: {},
                    }
                  }
                  //Add steps
                  documents[el.recordid].steps[el.step] = el.values;

                });

                // Inject into scope
                $scope.data = documents;
                //$scope.datacount = documents.length;
                $scope.datalength = Object.keys(documents).length;

                var from = (parseInt(perpage) * (parseInt(currentpage)-1)) +1;
                if (from < 1) { from = 1; }
                $scope.from = from;

                // When using this view alone, open the search
                if (typeof $rootScope.searching === "undefined")
                    $scope.doFocus();

/*
    // DEBUG
    $scope.mytable.show = true;
    $scope.searching = true;
*/

            }); // api content

        }); // api users
    }

    // First time call to get data - with defaults
    $scope.reloadTable(perpageDefault, currentpageDefault);

    $scope.removeRecord = function(id) {
        var contentHandle = StepContent.build(id, null);
        contentHandle.unsetData(id).then();
    }
});
