<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Fungsi untuk menghasilkan kode unik
function generateUniqueCode($length = 12) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    
    return $randomString;
}

// Fungsi untuk memeriksa apakah kode unik
function isCodeUnique($code, $connection) {
    $stmt = $connection->prepare("SELECT COUNT(*) as count FROM orders WHERE kode_order = ?");
    $stmt->bind_param('s', $code);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    return $row['count'] == 0;
}

// Fungsi untuk menghasilkan dan memeriksa kode unik
function generateAndCheckUniqueCode($connection, $length = 12) {
    do {
        $code = generateUniqueCode($length);
    } while (!isCodeUnique($code, $connection));
    
    return $code;
}

// Ambil data dari permintaan POST
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id, $data->lat, $data->lng, $data->kondisi)) {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
    exit;
}

$id_pemesan = $conn->real_escape_string($data->id);
$lat_tujuan = $conn->real_escape_string($data->lat);
$lon_tujuan = $conn->real_escape_string($data->lng);
$kondisi = $conn->real_escape_string($data->kondisi);

// Query untuk memeriksa apakah ada pesanan aktif dengan id_pemesan yang sama
$checkSql = "
SELECT COUNT(*) as count
FROM orders
WHERE id_pemesan = '$id_pemesan' AND status NOT IN ('Selesai', 'Ditolak')
";

$checkResult = $conn->query($checkSql);

if ($checkResult === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

$checkRow = $checkResult->fetch_assoc();
if ($checkRow['count'] > 0) {
    echo json_encode(["success" => false, "message" => "Anda masih mempunyai pesanan yang masih aktif atau belum selesai"]);
    exit;
}

// Generate kode_order yang unik
$kode_order = generateAndCheckUniqueCode($conn);

// Query untuk memasukkan data pemesanan
$sql = "INSERT INTO orders (kode_order, id_pemesan, lat_tujuan, lon_tujuan, kondisi) VALUES ('$kode_order', '$id_pemesan', '$lat_tujuan', '$lon_tujuan', '$kondisi')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Pemesanan Ambulans Berhasil", "kode_order" => $kode_order]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
