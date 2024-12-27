<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Query untuk mengambil semua data dari tabel ambulances
$sql = "SELECT * FROM ambulances";
$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

$ambulances = [];

// Mengambil data dari hasil query
while ($row = $result->fetch_assoc()) {
    $ambulances[] = [
        "id_ambulans" => $row['id_ambulans'],
        "nama" => $row['nama'],
        "tipe" => $row['tipe'],
        "plat" => $row['plat_nomor'],
        "lat" => $row['lat'],
        "lon" => $row['lon'],
        "status" => $row['status'],
        "gambar" => $row['gambar'],
        
    ];
}

// Menutup koneksi database
$conn->close();

// Mengembalikan data dalam bentuk JSON
echo json_encode([
    "success" => true,
    "data" => $ambulances
]);
?>
