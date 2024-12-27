<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Ambil data dari permintaan POST
$data = json_decode(file_get_contents("php://input"));

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

$id_sopir = $conn->real_escape_string($data->id);

if (empty($id_sopir)) {
    echo json_encode(["success" => false, "message" => "Missing id_sopir"]);
    exit;
}

// Query untuk mendapatkan detail pemesanan dan nama sopir dengan status selain "selesai"
$sql = "
SELECT orders.*, users.name as nama_pemesan, ambulances.nama as nama_ambulans
FROM orders
JOIN users ON orders.id_pemesan = users.id
JOIN ambulances ON orders.id_ambulans = ambulances.id_ambulans
WHERE orders.id_sopir = '$id_sopir' AND (orders.status != 'Selesai' AND orders.status != 'Ditolak')
";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

if ($result->num_rows > 0) {
    $order = $result->fetch_assoc();

    $lat = $order['lat_tujuan'];
    $lon = $order['lon_tujuan'];

    // Panggil Nominatim API untuk mendapatkan nama alamat
    $url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lon";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'MyApp/1.0 (myemail@example.com)');
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($httpCode == 200 && !empty($response)) {
        $locationData = json_decode($response, true);
        $address = $locationData['display_name'] ?? 'Address not found';
    } else {
        error_log("cURL Error: " . $curlError); // Log untuk debug cURL
        $address = 'Address not found';
    }

    echo json_encode([
        "success" => true,
        "order" => [
            "id_pemesan" => $order['id_pemesan'],
            "id_ambulans" => $order['id_ambulans'],
            "kode" => $order['kode_order'],
            "pemesan" => $order['nama_pemesan'],
            "ambulans" => $order['nama_ambulans'],
            "lat" => $order['lat_tujuan'],
            "lon" => $order['lon_tujuan'],
            "address" => $address,
            "status" => $order['status'],
            "waktu" => $order['waktu_order'],
            "kondisi" => $order['kondisi'],
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Order tidak ditemukan"]);
}

$conn->close();
?>
