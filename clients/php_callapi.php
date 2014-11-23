<?PHP

// Initialize the cURL session with the request URL
$session = curl_init($url);

// Tell cURL to return the request data
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Set the HTTP request authentication headers
$headers = array(
    'DecibelAppID: ' . $applicationID,
    'DecibelAppKey: ' . $applicationKey,
    'DecibelTimestamp: ' . date('Ymd H:i:s', time())
);
curl_setopt($session, CURLOPT_HTTPHEADER, $headers);

// Execute cURL on the session handle
$response = curl_exec($session);

// Close the cURL session
curl_close($session);

# ALTERNATIVE

$service_url = 'http://example.com/rest/user/';
$curl = curl_init($service_url);
$curl_post_data = array(
    "user_id" => 42,
    "emailaddress" => 'lorna@example.com',
    );
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
$curl_response = curl_exec($curl);
curl_close($curl);

$xml = new SimpleXMLElement($curl_response);

/******************************************************/
// Data: array("param" => "value") ==> index.php?param=value
//http://php.net/manual/en/book.curl.php

function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}


/******************************************************/
# https://developer.yahoo.com/php/howto-reqRestPhp.html

?>