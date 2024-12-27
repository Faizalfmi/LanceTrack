<?php
include 'koneksi.php';

$sql = "SELECT id, nama FROM drivers";
$result = $conn->query($sql);

$options = '';
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $options .= '<option value="' . $row['id'] . '">' . $row['nama'] . '</option>';
    }
}

echo $options;

$conn->close();
?>
