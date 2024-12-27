<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $nik = $input['nik'];
    $newPassword = $input['newPassword'];

    // Validasi input
    if (empty($nik) || empty($newPassword)) {
        echo json_encode(["success" => false, "message" => "New password is required"]);
        exit;
    }

    // Update password baru
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE NIK = ?");
    $stmt->bind_param("ss", $hashedPassword, $nik);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Password has been reset"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to reset password"]);
    }

    $stmt->close();
    $conn->close();
}
?>
