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

// Query untuk mendapatkan detail pemesanan, nama sopir, nama ambulans, dan jumlah ulasan dengan status selain "selesai"
$sql = "
SELECT orders.*, drivers.nama as sopir_name, ambulances.nama as ambulans_name,
       IFNULL(review_counts.review_count, 0) as review_count
FROM orders
JOIN drivers ON orders.id_sopir = drivers.id
JOIN ambulances ON orders.id_ambulans = ambulances.id_ambulans
LEFT JOIN (
    SELECT kode_order, COUNT(*) as review_count
    FROM reviews
    GROUP BY kode_order
) as review_counts ON orders.kode_order = review_counts.kode_order
WHERE orders.id_pemesan = '$id_pemesan' AND (orders.status = 'selesai' OR orders.status = 'ditolak')
ORDER BY orders.waktu_order DESC";

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
        "id_sopir" => $order['id_sopir'],
        "kode" => $order['kode_order'],
        "sopir" => $order['sopir_name'],
        "ambulans" => $order['ambulans_name'],
        "lat" => $order['lat_tujuan'],
        "lon" => $order['lon_tujuan'],
        "address" => $address,
        "status" => $order['status'],
        "waktu" => $order['waktu_order'],
        "review_count" => $order['review_count'],
    ];
}

if (!empty($orders)) {
    echo json_encode(["success" => true, "order" => $orders]);
} else {
    echo json_encode(["success" => false, "message" => "Order tidak ditemukan"]);
}

$conn->close();
?>
