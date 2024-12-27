<?php
include 'koneksi.php';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $no_hp = $_POST['no_hp'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $sql = "INSERT INTO drivers (nama, email, no_hp, password) VALUES ('$nama', '$email', '$no_hp', '$password')";

    // Execute the statement
    if ($conn->query($sql) === TRUE) {
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
    <title>Add Sopir</title>
</head>
<body>
    <h1>Add New Sopir</h1>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" enctype="multipart/form-data">
        <label for="nama">Nama:</label><br>
        <input type="text" id="nama" name="nama" required><br><br>

        <label for="email">Email:</label><br>
        <input type="text" id="email" name="email" required><br><br>

        <label for="no_hp">No_HP:</label><br>
        <input type="text" id="no_hp" name="no_hp" required><br><br>

        <label for="password">Password:</label><br>
        <input type="text" id="password" name="password" required><br><br>

        <input type="submit" value="Submit">
    </form>
</body>
</html>
