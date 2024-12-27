<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $nik = $input['nik'];
    $birthDate = $input['birthDate'];

    // Validasi input
    if (empty($nik) || empty($birthDate)) {
        echo json_encode(["success" => false, "message" => "NIK tanggal lahir harus diisi"]);
        exit;
    }

    // Cek NIK di database lokal
    $stmt = $conn->prepare("SELECT * FROM users WHERE NIK = ?");
    $stmt->bind_param("s", $nik);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        echo json_encode(["success" => false, "message" => "Akun dengan NIK tersebut tidak ditemukan"]);
        exit;
    }

    // Validasi tanggal lahir menggunakan API validator KTP
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
        echo json_encode(["success" => false, "message" => "API request error: $err"]);
        exit;
    }

    $apiData = json_decode($response, true);

    if ($apiData['result']['status'] !== 'success' || $apiData['result']['data']['lahir'] !== $birthDate) {
        echo json_encode(["success" => false, "message" => "NIK and birth date do not match"]);
        exit;
    }

    echo json_encode(["success" => true, "message" => "NIK and birth date are valid"]);
}
?>
