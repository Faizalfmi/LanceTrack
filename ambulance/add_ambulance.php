<?php
include 'koneksi.php';

$upload_dir = 'uploads/';

// Check if the uploads directory exists, if not create it
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = $_POST['nama'];
    $plat_nomor = $_POST['plat_nomor'];
    $tipe = $_POST['tipe'];
    $status = $_POST['status'];
    $gambar = '';

    // Check if file was uploaded without errors
    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] == 0) {
        $filename = basename($_FILES['gambar']['name']);
        $target_file = $upload_dir . DIRECTORY_SEPARATOR . $filename;
        $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Allow certain file formats
        $allowed_types = array("jpg", "jpeg", "png", "gif");
        if (in_array($file_type, $allowed_types)) {
            // Move the uploaded file to the target directory
            if (move_uploaded_file($_FILES['gambar']['tmp_name'], $target_file)) {
                $gambar = $target_file;
            } else {
                echo "Error: There was a problem uploading the file.";
                exit();
            }
        } else {
            echo "Error: Only JPG, JPEG, PNG, and GIF files are allowed.";
            exit();
        }
    } else {
        echo "Error: " . $_FILES['gambar']['error'];
        exit();
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO ambulances (nama, plat_nomor, tipe, status, gambar) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nama, $plat_nomor, $tipe, $status, $gambar);

    // Execute the statement
    if ($stmt->execute()) {
        // Redirect to home.php after successful insertion
        header("Location: home.php");
        exit(); // Ensure script termination after redirect
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement
    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Ambulance</title>
</head>
<body>
    <h1>Add New Ambulance</h1>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" enctype="multipart/form-data">
        <label for="nama">Nama:</label><br>
        <input type="text" id="nama" name="nama" required><br><br>

        <label for="plat_nomor">Plat Nomor:</label><br>
        <input type="text" id="plat_nomor" name="plat_nomor" required><br><br>

        <label for="tipe">Tipe:</label><br>
        <select id="tipe" name="tipe" required>
            <option value="darurat">Darurat</option>
            <option value="operasional">Operasional</option>
            <option value="jenazah">Jenazah</option>
        </select><br><br>

        <label for="status">Status:</label><br>
        <select id="status" name="status" required>
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
        </select><br><br>

        <label for="gambar">Gambar:</label><br>
        <input type="file" id="gambar" name="gambar" required><br><br>

        <input type="submit" value="Submit">
    </form>
</body>
</html>
