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

$id_pemesan = $conn->real_escape_string($data->id);

if (!$id_pemesan) {
    echo json_encode(["success" => false, "message" => "Missing id_pemesan"]);
    exit;
}

// Query untuk mendapatkan detail pemesanan dan nama sopir dengan status selain "selesai"
$sql = "
SELECT orders.*, users.name as customer_name, ambulances.nama as ambulans_name, reviews.rating_sopir as rating, reviews.review_sopir as review
FROM orders
JOIN users ON orders.id_pemesan = users.id
JOIN ambulances ON orders.id_ambulans = ambulances.id_ambulans
JOIN reviews ON orders.id_sopir = reviews.id_sopir
WHERE orders.id_pemesan = '$id_pemesan' AND (orders.status = 'selesai' OR orders.status = 'ditolak')
ORDER BY orders.waktu_order DESC
";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

$orders = [];
while ($order = $result->fetch_assoc()) {
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
    curl_close($ch);

    if ($httpCode == 200) {
        $locationData = json_decode($response, true);
        $address = $locationData['display_name'] ?? 'Address not found';
    } else {
        $address = 'Address not found';
    }

    $orders[] = [
        "id" => $order['id_pemesan'],
        "id_ambulans" => $order['id_ambulans'],
        "id_pemesan" => $order['id_pemesan'],
        "kode" => $order['kode_order'],
        "pemesan" => $order['customer_name'],
        "ambulans" => $order['ambulans_name'],
        "lat" => $order['lat_tujuan'],
        "lon" => $order['lon_tujuan'],
        "address" => $address,
        "status" => $order['status'],
        "waktu" => $order['waktu_order'],
        "rating" => $order['rating'],
        "review" => $order['review'],
    ];
}

if (!empty($orders)) {
    echo json_encode(["success" => true, "order" => $orders]);
} else {
    echo json_encode(["success" => false, "message" => "Order tidak ditemukan"]);
}

$conn->close();
?>
