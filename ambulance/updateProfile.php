<?php
header('Content-Type: application/json');
require 'koneksi.php'; 

$response = array('success' => false, 'message' => '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil input dari body request
    $input = json_decode(file_get_contents('php://input'), true);

    // Validasi input
    if (!isset($input['id']) || !isset($input['name']) || !isset($input['email']) || !isset($input['hp']) || !isset($input['NIK'])) {
        $response['message'] = 'Invalid input';
        echo json_encode($response);
        exit();
    }

    $id = $input['id'];
    $name = $input['name'];
    $email = $input['email'];
    $hp = $input['hp'];
    $NIK = $input['NIK'];

    // Koneksi ke database
    include 'koneksi.php';

    // Perbarui data pengguna
    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, hp = ?, NIK = ? WHERE id = ?");
    $stmt->bind_param('ssssi', $name, $email, $hp, $NIK, $id);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Profile updated successfully';
    } else {
        $response['message'] = 'Failed to update profile: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    $response['message'] = 'Invalid request method';
}

echo json_encode($response);
?>
