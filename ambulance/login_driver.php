<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Ambil data dari permintaan POST
$data = json_decode(file_get_contents("php://input"));

$email = $conn->real_escape_string($data->email);
$password = $conn->real_escape_string($data->password);

error_log("Email: $email, Password: $password"); // Log untuk debug

// Query untuk mendapatkan user
$sql = "SELECT * FROM drivers WHERE email = '$email'";
$result = $conn->query($sql);

error_log("SQL Query: $sql"); // Log untuk debug query

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
                "nama" => $user['nama'],
                "email" => $user['email'],
                "hp" => $user['no_hp'],
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
