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

$id_ambulans = $conn->real_escape_string($data->id_ambulans);

if (!$id_ambulans) {
    echo json_encode(["success" => false, "message" => "Missing id_ambulans"]);
    exit;
}

// Query untuk mendapatkan detail pemesanan dan nama sopir dengan status selain "selesai"
$sql = "
SELECT reviews.*, ambulances.nama as nama_ambulans, drivers.nama as nama_sopir, users.name as nama_pemesan FROM reviews
JOIN ambulances on reviews.id_ambulans = ambulances.id_ambulans
JOIN drivers on reviews.id_sopir = drivers.id
JOIN users on reviews.id_pemesan = users.id
WHERE reviews.id_ambulans = '$id_ambulans'
ORDER BY reviews.waktu DESC
";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["success" => false, "message" => "Query Error: " . $conn->error]);
    exit;
}

$reviews = [];
$total_rating_ambulans = 0;
$total_rating_sopir = 0;
$count_reviews = 0;

while ($review = $result->fetch_assoc()) {
    $reviews[] = [
        "id" => $review['id'],
        "kode_order" => $review['kode_order'],
        "nama_pemesan" => $review['nama_pemesan'],
        "nama_ambulans" => $review['nama_ambulans'],
        "nama_sopir" => $review['nama_sopir'],
        "rating_ambulans" => $review['rating_ambulans'],
        "review_ambulans" => $review['review_ambulans'],
        "rating_sopir" => $review['rating_sopir'],
        "review_sopir" => $review['review_sopir'],
        "waktu" => $review['waktu'],
    ];
    $total_rating_ambulans += $review['rating_ambulans'];
    $total_rating_sopir += $review['rating_sopir'];
    $count_reviews++;
}

$average_rating_ambulans = $count_reviews ? $total_rating_ambulans / $count_reviews : 0;
$average_rating_sopir = $count_reviews ? $total_rating_sopir / $count_reviews : 0;

if (!empty($reviews)) {
    echo json_encode([
        "success" => true, 
        "review" => $reviews, 
        "rata_ambulans" => $average_rating_ambulans, 
        "rata_sopir" => $average_rating_sopir,
        "total" => $count_reviews
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Review tidak ditemukan"]);
}

$conn->close();
?>
