'use strict';

myApp
 .controller('ViewController', function ($scope, $rootScope, $timeout, API, StepContent, perpageDefault, currentpageDefault, focus
    , RestAPI)
{

/* NEW JSON API TEST */

var myapi = RestAPI.all('newsteps');
myapi.get('').then(function(out){
  console.log("Received", out.count);
  console.log(out.data);
});

/*
////////////////////////////////////////
var api = RestAPI.all('newstep');
//console.log(api)

var obj =
{
    "title": "Javascript",
    "description": "JS",
    "done": 3,
    "uri": "http://google.it",
    'Hello':'World',
    // 'uri': [
    //     1,2,"tre",
    //     {
    //         1: 'tmp',
    //         'tmp': 2,
    //     },
    // ],
};

    api.post(obj).then(function(out){
        console.log("Received", out);
        console.log(out.title)
    });
    return;
////////////////////////////////////////
*/

    $scope.range = function(min, max, step){
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) input.push(i);
      return input;
    };

    // Init: Html scope data
    $scope.datacount = 0;
    $scope.from = 0;
    $scope.data = {};
    $scope.headers = [ "Operatore", "Estratto", "Altro", "Azioni" ];
    $scope.perpage = perpageDefault;
    $scope.currentpage = currentpageDefault;
    $scope.pages = [];

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

    $scope.selected = undefined;
    $scope.tofilter = undefined;
    var lastSelected = undefined;
    $scope.search = function()
    {
      if ($scope.selected == lastSelected)
        return;
      //console.log("Searching: ", $scope.selected);
/*
      console.log($scope.data);
      if (typeof $scope.extra[$scope.selected] !== "undefined")
      {
          $scope.tofilter = $scope.extra[$scope.selected]
          console.log("Filter!", $scope.tofilter);
      }
*/
      $scope.reloadTable($scope.perpage, $scope.currentpage, $scope.selected)

      lastSelected = $scope.selected
    }
    // ***************************************
    // TYPEAHEAD init
    $scope.onTypeaheadSelect = function (item, model, label)
    {
      $scope.search(item);
      // console.log("Item "+item);
      // console.log("Model "+model);
      // console.log("Label "+label);
    }
    $scope.typeahead = { data:[] };
    // ***************************************

  /* ************************************
  ***************************************
   Refresh datatable from API call
  ***************************************
  ************************************* */
    var resource = 'stepscontent';
    var userresource = 'accounts';

    //////////////////////////////
    // Extrait vocabulary
    $scope.extra = {};
    API.get(resource, {perpage: 10000, currentpage: 1}).then(function(data) {
        var ext = {};
        data.items.forEach(function(el, key){
            if (el.step == "1")
                ext[el.values[0]] = el.id;
        });
        $scope.typeahead = { data: Object.keys(ext) };
          //'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California'
        //console.log(ext);
        $scope.extra = ext;
    });



    //Bind data in html to function
    $scope.reloadTable = function(perpage, currentpage, searchvalue)
// TO FIX - enable some cache!
    {
      if (currentpage < 1) currentpage = 1;
      $scope.currentpage = currentpage;
      //console.log(perpage, currentpage, "Search", searchvalue);

      // Get the data (as a promise)
      var params = {perpage: perpage, currentpage: currentpage};

// TO FIX - use userlist inside resolve??
      // GET USERS list
      API.get(userresource).then(function(res)
      {

          var users = {};
          res.items.forEach(function(obj, key){
            var hash = obj.id.substr(0, 8);
            users[hash] = obj.name + obj.surname.substr(0, 1);
          });
          //console.log("Users", users);

// #######################################
// Get info only about Estratto
          params.step = 1;
          params.filterfield = 'extract';
          params.filtervalue = searchvalue;
// #######################################

          API.get(resource, params).then(function(data) {

                //console.log(data);

                var documents = {}
                var hashes = {};

                data.items.forEach(function(el, key){

                  //console.log("Record", el.recordid, "Step", el.step, "vals", el.values);
                  // Create record
                  if (!hashes[el.recordid]) {
                    // hashes
                    hashes[el.recordid] = true;
                    // Current element
                    documents[el.recordid] =
                    {
                        ts: el.latest_timestamp,
                        modified: new Date(el.latest_timestamp*1000),
                        user: users[el.user],
                        id: el.recordid,
                        name: el.values[0],
                        steps: el.values,
                    }
                  }
                });

                // Inject into scope
                $scope.data = documents;
                //$scope.datalength = Object.keys(documents).length;
                $scope.datalength = data.count;

                var from = (parseInt(perpage) * (parseInt(currentpage)-1)) +1;
                if (from < 1) { from = 1; }
                $scope.from = from;

                // DEFINE pages array from perpage and currentpage and data size
                $scope.pages = Math.floor((data.count / $scope.perpage)) + 1;
                $scope.startpages = $scope.currentpage - 5;
                if ($scope.startpages < 1) $scope.startpages = 1;
                $scope.endpages = $scope.startpages + 9;
                if ($scope.endpages > $scope.pages) $scope.endpages = $scope.pages;
                //console.log("Pages are", $scope.pages, "for length", data.count);

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

    /////////////////////////////////////////////
    // ALERTS
    $scope.alerts = [];
    $scope.addAlert = function(text, atype) {
        // Types:
        // success, danger, warning, primary
        if (!atype)
            atype = 'info'
        $scope.alerts.push({msg: text, type: atype});
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.closeAlerts = function(index) {
        do{
            $scope.closeAlert();
        } while($scope.alerts.length > 0);
    };

//debug
//$scope.addAlert('test');
    /////////////////////////////////////////////

    $scope.removeRecord = function(id) {
        var contentHandle = StepContent.build(id, null);

        // REMOVING
        $scope.addAlert("Removing...");

        contentHandle.unsetData(id).then(function(completed){
            // clean alerts
            $scope.closeAlerts();

            if (completed) {
                // REMOVED
                console.log("Refresh");
                $scope.reloadTable(perpageDefault, currentpageDefault);
                $scope.addAlert("Removed item!", 'success');
                $timeout(function(){
                    $scope.closeAlert();
                }, 2000);
            }
        });
    }
});
