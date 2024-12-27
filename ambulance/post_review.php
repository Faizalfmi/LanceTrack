<?php
header("Content-Type: application/json");
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->kode, $data->id, $data->id_ambulans, $data->id_sopir, $data->rating1, $data->rating2, $data->review1, $data->review2)) {
    echo json_encode(["success" => false, "message" => "Data kurang, pastikan anda memberikan rating dan ulasan ke sopir dan ambulans."]);
    exit;
}

$id = $conn->real_escape_string($data->id);
$kode_order = $conn->real_escape_string($data->kode);
$id_ambulans = $conn->real_escape_string($data->id_ambulans);
$id_sopir = $conn->real_escape_string($data->id_sopir);
$rating_sopir = $conn->real_escape_string($data->rating1);
$review_sopir = $conn->real_escape_string($data->review1);
$rating_ambulans = $conn->real_escape_string($data->rating2);
$review_ambulans = $conn->real_escape_string($data->review2);

$sql = "INSERT INTO reviews (kode_order, id_pemesan, id_ambulans, rating_ambulans, review_ambulans, id_sopir, rating_sopir, review_sopir) VALUES ('$kode_order', '$id', '$id_ambulans', '$rating_ambulans', '$review_ambulans', '$id_sopir', '$rating_sopir', '$review_sopir')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Terima kasih atas ulasan yang anda berikan", "kode_order" => $kode_order]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
