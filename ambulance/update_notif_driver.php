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

$id = $conn->real_escape_string($data->id);

if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing id"]);
    exit;
}

// Query untuk memperbarui status notifikasi menjadi 'read'
$sql = "
UPDATE notifications_driver SET status = 'read'
WHERE user_id = '$id' AND status = 'unread'
";

if ($conn->query($sql) === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

// Menutup koneksi database
$conn->close();

// Mengembalikan respons sukses dalam format JSON
echo json_encode([
    "success" => true,
    "message" => "Notifications updated successfully"
]);
?>
