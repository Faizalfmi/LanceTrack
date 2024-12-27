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

// Query untuk mendapatkan notifikasi berdasarkan user_id dan menghitung jumlah notifikasi dengan status 'unread'
$sql = "
SELECT pesan, status, waktu, order_status,
       (SELECT COUNT(*) FROM notifications_driver WHERE user_id = '$id' AND status = 'unread') AS unread_count
FROM notifications_driver
WHERE user_id = '$id'
ORDER BY waktu DESC
";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

$notif = [];
$unread_count = 0;

// Mengambil data dari hasil query
while ($row = $result->fetch_assoc()) {
    if (isset($row['unread_count'])) {
        $unread_count = $row['unread_count'];
    }
    $notif[] = [
        "pesan" => $row['pesan'],
        "status" => $row['status'],
        "waktu" => $row['waktu'],
        "order_status" => $row['order_status'],
    ];
}

// Menutup koneksi database
$conn->close();

// Mengembalikan data dalam format JSON
echo json_encode([
    "success" => true,
    "notif" => $notif,
    "unread" => $unread_count
]);
?>
