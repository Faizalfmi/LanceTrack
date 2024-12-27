<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Ambil data dari permintaan POST
$data = json_decode(file_get_contents("php://input"));

if (!isset( $data->email, $data->password)) {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
    exit;
}

$email = $conn->real_escape_string($data->email);
$password = $conn->real_escape_string($data->password);

// Query untuk mendapatkan user
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verifikasi password
    if (password_verify($password, $user['password'])) {
        // Generate token (misalnya, menggunakan JWT)
        $token = bin2hex(random_bytes(16)); // Ganti dengan implementasi token yang sesuai

        echo json_encode([
            "success" => true,
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "hp" => $user['hp'],
                "NIK" => $user['NIK'],
                "role" => $user['role'],
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Password salah"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User tidak ditemukan"]);
}

$conn->close();
?>
