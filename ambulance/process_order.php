<?php
include 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $kode_order = $_POST['kode_order'];
    $id_sopir = $_POST['id_sopir'];
    $user_id = $_POST['id_pemesan'];
    $pesan = "Order dengan kode $kode_order telah diterima oleh sopir dengan ID $id_sopir.";
    $pesan2 = "Anda mendapatkan tugas penjemputan pasien dengan ambulans dengan kode pemesanan $kode_order.";
    $status = 'unread';
    $order_status = 'Diterima';
    $order_status2 = 'Tugas Baru';

    // Perform SQL update to change order status and assign driver
    $sql_update = "UPDATE orders SET id_sopir = ?, status = 'diterima' WHERE kode_order = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("is", $id_sopir, $kode_order);

    if ($stmt_update->execute()) {
        // Check if user_id exists in users table
        $sql_check_user = "SELECT id FROM users WHERE id = ?";
        $stmt_check_user = $conn->prepare($sql_check_user);
        $stmt_check_user->bind_param("i", $user_id);
        $stmt_check_user->execute();
        $stmt_check_user->store_result();

        $sql_check_driver = "SELECT id FROM drivers WHERE id = ?";
        $stmt_check_driver = $conn->prepare($sql_check_driver);
        $stmt_check_driver->bind_param("i", $id_sopir);
        $stmt_check_driver->execute();
        $stmt_check_driver->store_result();
        
        if ($stmt_check_user->num_rows > 0 && $stmt_check_driver->num_rows > 0) {
            // Prepare SQL insert to add notification
            $sql_insert = "INSERT INTO notifications (user_id, pesan, status, order_status) VALUES (?, ?, ?, ?)";
            $stmt_insert = $conn->prepare($sql_insert);
            $stmt_insert->bind_param("isss", $user_id, $pesan, $status, $order_status);

            $sql_insert2 = "INSERT INTO notifications_driver (user_id, pesan, status) VALUES (?, ?, ?)";
            $stmt_insert2 = $conn->prepare($sql_insert2);
            $stmt_insert2->bind_param("iss", $id_sopir, $pesan2, $status2);

            if ($stmt_insert->execute() && $stmt_insert2->execute()) {
                // Redirect or do something after successful update and insert
                header("Location: home.php");
                exit();
            } else {
                echo "Error inserting notification: " . $stmt_insert->error;
            }
            
            $stmt_insert->close();
        } else {
            echo "Error: user_id $user_id does not exist in users table.";
        }
        
        $stmt_check_user->close();
    } else {
        echo "Error updating order: " . $stmt_update->error;
    }

    $stmt_update->close();
}

$conn->close();
?>
