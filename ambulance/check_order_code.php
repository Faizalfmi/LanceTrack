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

$kode_order = $conn->real_escape_string($data->orderCode);

if (!$kode_order) {
    echo json_encode(["success" => false, "message" => "Missing kode_order"]);
    exit;
}

// Query untuk mendapatkan detail pemesanan dan nama sopir dengan status selain "selesai"
$sql = "
SELECT orders.*, drivers.nama as sopir_name, users.name as nama_pemesan
FROM orders
JOIN drivers ON orders.id_sopir = drivers.id
JOIN users ON orders.id_pemesan = users.id
WHERE orders.kode_order = '$kode_order' AND (orders.status != 'selesai' AND orders.status != 'ditolak')
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
    curl_close($ch);

    if ($httpCode == 200) {
        $locationData = json_decode($response, true);
        $address = $locationData['display_name'] ?? 'Address not found';
    } else {
        $address = 'Address not found';
    }

    echo json_encode([
        "success" => true,
        "id_ambulans" => $order['id_ambulans'],
        "order" => [
            "id" => $order['id_pemesan'],
            "id_ambulans" => $order['id_ambulans'],
            "kode" => $order['kode_order'],
            "sopir" => $order['sopir_name'],
            "pemesan" => $order['nama_pemesan'],
            "lat" => $order['lat_tujuan'],
            "lon" => $order['lon_tujuan'],
            "address" => $address,
            "status" => $order['status'],
            "waktu" => $order['waktu_order'],
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Order tidak ditemukan"]);
}

$conn->close();
?>
