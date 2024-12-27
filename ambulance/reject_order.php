<?php
include 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $kode_order = $_POST['kode_order'];
    $alasan = $_POST['alasan'];

    // Perform SQL update to change order status and assign driver
    $sql = "UPDATE orders SET alasan = ?, status = 'ditolak' WHERE kode_order = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $alasan, $kode_order); // Use 'ss' for string parameters

    if ($stmt->execute()) {
        // Redirect or do something after successful update
        header("Location: home.php");
        exit();
    } else {
        echo "Error updating order: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>