<?php
header("Content-Type: application/json");

// Koneksi ke database
include 'koneksi.php';

// Mendapatkan input dari permintaan POST
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['kode']) && isset($data['status'])&& isset($data['id_pemesan'])) {
    $kode = $data['kode'];
    $status = $data['status'];
    $user_id = $data['id_pemesan'];
    
    if ($status === "Menunggu Ambulans Berangkat") {
        $pesan = "Pesanan dengan kode $kode saat ini sedang menunggu ambulans disiapkan sebelum berangkat.";
    }
    else if ($status === "Menuju Lokasi Pasien") {
        $pesan = "Pesanan dengan kode $kode saat ini ambulans sedang berjalan menuju lokasi pasien.";
    }
    else if ($status === "Tiba di Lokasi Pasien") {
        $pesan = "Pesanan dengan kode $kode saat ini ambulans sudah sampai di lokasi pasien.";
    }
    else if ($status === "Menuju Rumah Sakit") {
        $pesan = "Pesanan dengan kode $kode saat ini ambulans sedang dalam perjalanan menuju rumah sakit.";
    }
    else if ($status === "Sampai di Rumah Sakit") {
        $pesan = "Pesanan dengan kode $kode saat ini ambulans sudah sampai di rumah sakit tujuan.";
    }
    else if ($status === "Selesai") {
        $pesan = "Pesanan dengan kode $kode telah selesai dikerjakan.";
    }

    $status2 = 'unread';

    // Validasi status jika diperlukan
    $allowed_statuses = [
        'Diterima',
        'Menunggu Ambulans Berangkat',
        'Menuju Lokasi Pasien',
        'Tiba di Lokasi Pasien',
        'Menuju Rumah Sakit',
        'Sampai di Rumah Sakit',
        'Selesai'
    ];

    if (!in_array($status, $allowed_statuses)) {
        echo json_encode(['success' => false, 'message' => 'Status tidak valid']);
        exit;
    }

    // Query untuk memperbarui status pemesanan
    $sql = "UPDATE orders SET status = ? WHERE kode_order = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $kode);

    
        // Prepare SQL insert to add notification
        $sql_insert = "INSERT INTO notifications (user_id, pesan, status, order_status) VALUES (?, ?, ?, ?)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param("isss", $user_id, $pesan, $status2, $status);

        if ($stmt_insert->execute()) {
            echo json_encode(['success' => true, 'message' => 'Status pemesanan berhasil diperbarui']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui status pemesanan: ' . $conn->error]);
        }
        
        $stmt_insert->close();

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Parameter tidak lengkap']);
}

// Menutup koneksi database
$conn->close();
?>
