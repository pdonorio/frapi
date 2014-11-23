<?PHP

/* approfondimento?
http://www.copernica.com/en/support/rest/example-get-post-put-and-delete-requests
*/

# Check codes:
# http://www.ascii-code.com/http-status-codes.php
define ("OK", 200);
define ("NOT_FOUND", 404);

# Client (found with google)
include_once("RestClient.php");

####################
# CONFIGURATION
$options = array(
    'base_url' => "http://80.240.138.39:5005"
    //'headers' => array(),
    //'curl_options' => array(),
    //'username' => NULL, //'password' => NULL
);

####################
# CALL API
$client = new RestClient($options);
$out = $client->get("data");
//print_r($out); exit;

####################
# CHECK RESULTS - could be not empty also if there were errors
$data = NULL;
if ($out->headers->content_type == "application/json")
    $data = json_decode($out->response);
#debug
//if ($data !== NULL) print_r($data); exit;

####################
# CHECK STATUS
$status = $out->info->http_code;
if ($status == NOT_FOUND) {
    print "There was an error\t";
    if ($data !== NULL)
        print "'{$data->message}'";
    print "\n";
} else if ($status == OK) {
    print "No problem at all!\t***GOOD TO GO***\n";
    print_r($data);
}

?>