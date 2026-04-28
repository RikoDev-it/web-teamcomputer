<?php
header('Content-Type: application/json; charset=utf-8');

$baseApi = 'http://api-teamcom.runasp.net/api/';

if (!isset($_GET['path']) || $_GET['path'] === '') {
    http_response_code(400);
    echo json_encode([
        'error' => 'Path parameter missing'
    ]);
    exit;
}

$path = $_GET['path'];
$url  = $baseApi . $path;

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 15,
]);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Curl failed',
        'detail' => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;

