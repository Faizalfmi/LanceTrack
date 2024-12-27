<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Ambil data dari permintaan POST
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name, $data->email, $data->phone, $data->nik, $data->password)) {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
    exit;
}

$name = $conn->real_escape_string($data->name);
$email = $conn->real_escape_string($data->email);
$phone = $conn->real_escape_string($data->phone);
$nik = $conn->real_escape_string($data->nik);
$password = password_hash($conn->real_escape_string($data->password), PASSWORD_BCRYPT);

// 1. Pengecekan apakah NIK sudah ada di database
$check_query = "SELECT * FROM users WHERE NIK = '$nik'";
$check_result = $conn->query($check_query);

if ($check_result->num_rows > 0) {
    // Jika NIK sudah ada di database, beri respons error
    echo json_encode(["success" => false, "message" => "NIK sudah terdaftar"]);
    exit;
}

// 2. Jika NIK belum ada di database, lakukan permintaan ke API KTP
$api_host = 'indonesia-ktp-parser-validator.p.rapidapi.com';
$api_key = '9580fba5e4msh0b1975595087760p111175jsn5632acb84156';

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://$api_host/ktp_validator",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode(["nik" => $nik]),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "x-rapidapi-host: $api_host",
        "x-rapidapi-key: $api_key"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo json_encode(["success" => false, "message" => "cURL Error #:" . $err]);
    exit;
} else {
    $api_response = json_decode($response, true);
    if ($api_response['result']['status'] === 'success' && $api_response['result']['pesan'] === 'VALID_NIK') {
        // Jika verifikasi NIK berhasil, masukkan data ke dalam tabel users
        $sql = "INSERT INTO users (name, email, hp, password, NIK) VALUES ('$name', '$email', '$phone', '$password', '$nik')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Registrasi berhasil"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error]);
        }
    } else {
        // Jika verifikasi NIK gagal atau NIK tidak valid
        echo json_encode(["success" => false, "message" => "Verifikasi NIK gagal atau NIK tidak valid"]);
    }
}

$conn->close();
?>
