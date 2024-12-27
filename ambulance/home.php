<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta content="initial-scale=1, minimum-scale=1, width=device-width" name="viewport">
	<meta name="robots" content="all,follow">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
	<title>SIMPLE UI &mdash; Admin Templates</title>
	<link rel="icon" href="images/logo.png" sizes="32x32">
	<!-- inject:css -->
  	<link rel="stylesheet" href="vendors/fomantic-ui/semantic.min.css">
  	<link rel="stylesheet" href="css/main.css">
  	<!-- endinject -->
  	<!-- chartjs:css -->
	<link rel="stylesheet" href="vendors/chart.js/Chart.min.css">
	<!-- endinject -->
	
</head>
<style>
	#map {
            height: 600px;
        }
	.modal {
    display: none; /* Initially hide modal */
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4); /* Black background with transparency */
	}

	.modal-content {
		background-color: #fefefe;
		margin: 15% auto;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
	}

	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
</style>
<?php
include 'koneksi.php';

$sql = "
SELECT orders.*, users.name as nama_pemesan
FROM orders
JOIN users ON orders.id_pemesan = users.id
WHERE orders.status = 'Menunggu Konfirmasi'
";

$result = $conn->query($sql);

$sql2 = "SELECT * FROM ambulances";
$result2 = $conn->query($sql2);
$sql4 = "SELECT * FROM ambulances";
$result4 = $conn->query($sql4);

$ambulans = [];
if ($result4->num_rows > 0) {
    while($row = $result4->fetch_assoc()) {
	

		$lat = $row['lat'];
		$lon = $row['lon'];

		// Panggil Nominatim API untuk mendapatkan nama alamat
		$url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lon";

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_USERAGENT, 'MyApp/1.0 (myemail@example.com)');
		$response = curl_exec($ch);
		$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if ($httpCode == 200) {
			$locationData = json_decode($response, true);
			$address = $locationData['display_name'] ?? 'Address not found';
		} else {
			$address = 'Address not found';
		}
        $ambulans[] = [
            'lat' => $row['lat'], // pastikan nama kolom sesuai dengan tabel Anda
            'lon' => $row['lon'], // pastikan nama kolom sesuai dengan tabel Anda
            'nama' => $row['nama'], // pastikan nama kolom sesuai dengan tabel Anda
            'address' => $address // pastikan nama kolom sesuai dengan tabel Anda
        ];
    }
};

$sql3 = "SELECT * FROM drivers";
$result3 = $conn->query($sql3);
$conn->close();
?>
<body>
	<div class="ui grid">
				<div class="row">
			<div class="ui grid">
				<!-- BEGIN NAVBAR -->
				<!-- computer only navbar -->
				<div class="computer only row ">
					<div class="column">
						<div class="ui top fixed menu navcolor ">
							<div class="item">
								<img src="images/logo.png" alt="SimpleIU">
							</div>
							<div class="left menu">
								<div class="nav item">
									<strong class="navtext">SIMPLE UI</strong>
								</div>
							</div>
							<div class="ui top pointing dropdown admindropdown link item right">
								<img class="imgrad" src="images/user_icon.jpg" alt="" >
								<span class="clear navtext"><strong>Hi, Kabayan</strong></span>
								<i class="dropdown icon navtext"></i>
								<div class="menu">
									<div class="item"><p><i class="settings icon"></i>Account Setting</p></div>
									<a href="login.html" class="item"><i class="sign out alternate icon"></i> Logout</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- end computer only navbar -->
				<!-- mobile and tablet only navbar -->
				<div class="tablet mobile only row">
					<div class="column">
					<div class="ui top fixed menu navcolor">
						<a id="showmobiletabletsidebar" class="item navtext"><i class="content icon"></i></a>
						<div class="right menu">
							<div class="item">
								<strong class="navtext">SIMPLE UI</strong>
							</div>
							<div class="item">
								<img src="images/logo.png">
							</div>
						</div>
					</div>
					</div>
				</div>
				<!-- end mobile and tablet only navbar -->
				<!-- END NAVBAR -->

				<!-- BEGIN SIDEBAR -->
				<!-- mobile and tablet only sidebar -->
				<div class="tablet mobile only row">
					<div id="mobiletabletsidebar" class="mobiletabletsidebar animate hidden">
						<div class="ui left fixed vertical menu scrollable">
							<div class="item">
								<table>
									<tr>
										<td>
											<img class="ui mini image" src="images/logo.png">
										</td>
										<td>
											<span class="clear"><strong>SIMPLE UI</strong></span>
										</td>
									</tr>
								</table>
							</div>
							<a class="item" href="home.php"><i class="home icon"></i> Dashboard</a>
							<a class="item" href="table.html"><i class="table icon"></i> Table</a>
							<!-- Begin Simple Accordion -->
							<div class="ui accordion simpleaccordion item">
								<div class="title titleaccordion item"><i class="dropdown icon"></i> Settings</div>
								<div class="content contentaccordion">
									<a class="item itemaccordion" href="#"><i class="settings icon"></i> Account Setting</a>
									<a class="item itemaccordion" href="#"><i class="settings icon"></i> Site Setting</a>
								</div>
							</div>
							<!-- End Simple Accordion -->
							<a class="item"><i class="settings icon"></i> Settings</a>	
							<a href="login.html" class="item"><i class="sign out alternate icon"></i> Logout</a>
							<a class="item" href="https://fomantic-ui.com/"><i class="heart icon"></i>More Components</a>
							<div class="item" id="hidemobiletabletsidebar">
								<button class="fluid ui button">
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- end mobile and tablet only sidebar -->
				<!-- computer only sidebar -->
				<div class="computer only row">
					<div class="left floated three wide computer column" id="computersidebar">
						<div class="ui vertical fluid menu scrollable" id="simplefluid">
							<div class="clearsidebar"></div>
							<div class="item">
								<img src="images/user_icon.jpg" id="sidebar-image">
							</div>
							<a class="item" href="home.php"><i class="home icon"></i> Dashboard</a>
							<a class="item" href="table.html"><i class="table icon"></i> Table</a>
							<!-- Begin Simple Accordion -->
							<div class="ui accordion simpleaccordion item">
								<div class="title titleaccordion item"><i class="dropdown icon"></i> Settings</div>
								<div class="content contentaccordion">
									<a class="item itemaccordion" href="#"><i class="settings icon"></i> Account Setting</a>
									<a class="item itemaccordion" href="#"><i class="settings icon"></i> Site Setting</a>
								</div>
							</div>
							<!-- End Simple Accordion -->
							<a href="login.html" class="item"><i class="sign out alternate icon"></i> Logout</a>
							<a class="item" href="https://fomantic-ui.com/"><i class="heart icon"></i>More Components</a>
							<a class="item"></a>
						</div>
					</div>
				</div>
				<!-- end computer only sidebar -->
				<!-- END SIDEBAR -->
			</div>
		</div>
		<!-- BEGIN CONTEN -->
		<div class="right floated thirteen wide computer sixteen wide phone column" id="content">
			<div class="ui container grid">
				<div class="row">
					<div class="fifteen wide computer sixteen wide phone centered column">
						<h2><i class="home icon"></i> DASHBOARD</h2>
						<div class="ui divider"></div>
						<div class="ui grid">
							<!-- BEGIN STATISTIC ITEM -->
							<!-- Begin Page Views -->
							<div class="four wide computer sixteen wide phone centered column">
								<div class="ui raised segment">
									<div class="content">
										<div class="ui centered grid">
											<div class="row">
												<div class="six wide computer column">
													<div class="ui small image simpleimage itemcolor1">
															<i class="chart bar outline icon simpleicon"></i>
													</div>
												</div>
												<div class="ten wide computer column">
													<span><h4>Page Views</h4></span>
													7120 Views
													<a class="ui tiny label simplelable"><i class="eye icon"></i> Details</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- End Page Views -->
							<!-- Begin Messages -->
							<div class="four wide computer sixteen wide phone centered column">
								<div class="ui raised segment">
									<div class="content">
										<div class="ui centered grid">
											<div class="row">
												<div class="six wide computer column">
													<div class="ui small image simpleimage itemcolor2">
															<i class="inbox icon simpleicon"></i>
													</div>
												</div>
												<div class="ten wide computer column">
													<span><h4>Messages</h4></span>
													2341 Messages
													<a class="ui tiny label simplelable"><i class="eye icon"></i> Details</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- End Messages -->
							<!-- Begin Downloads -->
							<div class="four wide computer sixteen wide phone centered column">
								<div class="ui raised segment">
									<div class="content">
										<div class="ui centered grid">
											<div class="row">
												<div class="six wide computer column">
													<div class="ui small image simpleimage itemcolor3">
															<i class="download icon simpleicon"></i>
													</div>
												</div>
												<div class="ten wide computer column">
													<span><h4>Downloads</h4></span>
													5541 Downloads
													<a class="ui tiny label simplelable"><i class="eye icon"></i> Details</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- End Downloads -->
							<!-- Begin Users -->
							<div class="four wide computer sixteen wide phone centered column">
								<div class="ui raised segment">
									<div class="content">
										<div class="ui centered grid">
											<div class="row">
												<div class="six wide computer column">
													<div class="ui small image simpleimage itemcolor4">
															<i class="user icon simpleicon"></i>
													</div>
												</div>
												<div class="ten wide computer column">
													<span><h4>Users</h4></span>
													9578 Users
													<a class="ui tiny label simplelable"><i class="eye icon"></i> Details</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- End Users -->
							<!-- END STATISTIC ITEM -->

							<div class="">
								<h4>Pesanan Masuk</h4>
								
								<div class="ui tall stacked segment">
									<a class="ui blue ribbon label">Daftar Pemesanan Ambulans</a>
									<table border="1" width="100%">
										<tr>
											<th>Kode Order</th>
											<th>Nama Pemesan</th>
											<th>Nama Ambulans</th>
											<th>Nama Sopir</th>
											<th>Lokasi Jemput</th>
											<th>Status</th>
											<th>Alasan</th>
											<th>Kondisi Pasien</th>
											<th>Waktu Order</th>
											<th>Action</th>
										</tr>
										<?php
										if ($result->num_rows > 0) {
											while ($order = $result->fetch_assoc()) {
												$lat = $order['lat_tujuan'];
												$lon = $order['lon_tujuan'];

												// Panggil Nominatim API untuk mendapatkan nama alamat
												$url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lon";

												$ch = curl_init();
												curl_setopt($ch, CURLOPT_URL, $url);
												curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
												curl_setopt($ch, CURLOPT_USERAGENT, 'MyApp/1.0 (myemail@example.com)');
												$response = curl_exec($ch);
												$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
												curl_close($ch);

												if ($httpCode == 200) {
													$locationData = json_decode($response, true);
													$address = $locationData['display_name'] ?? 'Address not found';
												} else {
													$address = 'Address not found';
												}
												?>
												<tr>
													<td><?php echo htmlspecialchars($order['kode_order']); ?></td>
													<td><?php echo htmlspecialchars($order['nama_pemesan']); ?></td>
													<td><?php echo htmlspecialchars($order['nama_ambulans']); ?></td>
													<td><?php echo htmlspecialchars($order['nama_sopir']); ?></td>
													<td><?php echo htmlspecialchars($address); ?></td>
													<td><?php echo htmlspecialchars($order['status']); ?></td>
													<?php 
														if ($order['status'] == 'ditolak') {
															
														?>
														<td><?php echo htmlspecialchars($order['alasan']); ?></td>
													<?php }else{ ?>
														<td>-</td>
													<?php } ?>
													<td><?php echo htmlspecialchars($order['kondisi']); ?></td>
													<td><?php echo htmlspecialchars($order['waktu_order']); ?></td>
													<td>
														<?php 
														if ($order['status'] == 'Menunggu Konfirmasi') {
															
														
														?>
															<button class="terima-btn" data-kode-order="<?php echo htmlspecialchars($order['kode_order']); ?>" data-id-pemesan="<?php echo htmlspecialchars($order['id_pemesan']); ?>" data-status="<?php echo htmlspecialchars($order['status']); ?>">Terima</button>
															<button class="tolak-btn" data-kode-order2="<?php echo htmlspecialchars($order['kode_order']); ?>">Tolak</button>
														<?php
														}else{?>
															<button disabled class="terima-btn" data-kode-order="<?php echo htmlspecialchars($order['kode_order']); ?>">Terima</button>
															<button disabled href="edit_order.php?kode_order=<?php echo htmlspecialchars($order['kode_order']); ?>">Tolak</button>
														<?php
														}
														?>
													</td>
												</tr>
												<?php
											}
										} else {
											echo "<tr><td colspan='9'>No orders found</td></tr>";
										}
										?>
									</table>
									
								</div>
								<br>
								<br>
								
								<div id="map"></div>

								<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
								<script>
									function initMap() {
										// Data ambulans dari PHP
										var ambulans = <?php echo json_encode($ambulans); ?>;
										
										// Pastikan data ambulans ada sebelum inisialisasi peta
										if (ambulans.length === 0) {
											console.error('Tidak ada data ambulans yang tersedia.');
											return;
										}

										// Inisialisasi peta dengan lokasi pertama dari data ambulans
										var map = L.map('map').setView([ambulans[0].lat, ambulans[0].lon], 13);

										L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
											attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										}).addTo(map);

										// Definisikan ikon kustom
										var customIcon = L.icon({
											iconUrl: 'https://img.icons8.com/color/48/ambulance.png', // Ganti dengan URL ikon Anda
											iconSize: [38, 38], // Ukuran ikon
											iconAnchor: [19, 38], // Titik jangkar ikon
											popupAnchor: [0, -38] // Titik jangkar popup
										});

										// Tambahkan pin dengan ikon kustom untuk setiap ambulans
										ambulans.forEach(function(location) {
											var marker = L.marker([location.lat, location.lon], { icon: customIcon }).addTo(map);
											marker.bindPopup('<b>' + location.nama + '</b><br>' + location.address);
										});
									}

									document.addEventListener('DOMContentLoaded', initMap);
								</script>
								<br>
								<br>
								<h4>Data Ambulans</h4>
								
								<div class="ui tall stacked segment">
									<a class="ui blue ribbon label">Daftar Ambulans</a>
									<table border="1" width="100%">
										<tr>
											<th>ID Ambulans</th>
											<th>Nama Ambulans</th>
											<th>Tipe</th>
											<th>Plat Nomor</th>
											<th>Lokasi</th>
											<th>Gambar</th>
											<th>Status</th>
										</tr>
										<?php
										if ($result2->num_rows > 0) {
											// Output data of each row
											while($row = $result2->fetch_assoc()) {
												echo "<tr>";
												echo "<td>" . $row["id_ambulans"] . "</td>";
												echo "<td>" . $row["nama"] . "</td>";
												echo "<td>" . $row["tipe"] . "</td>";
												echo "<td>" . $row["plat_nomor"] . "</td>";
												
												// Convert lat and lon to address using Nominatim API
												$lat = $row['lat'];
												$lon = $row['lon'];
												$address = 'Address not found'; // Default value if address is not found
												
												// Panggil Nominatim API untuk mendapatkan nama alamat
												$url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lon";

												$ch = curl_init();
												curl_setopt($ch, CURLOPT_URL, $url);
												curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
												curl_setopt($ch, CURLOPT_USERAGENT, 'MyApp/1.0 (myemail@example.com)');
												$response = curl_exec($ch);
												$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
												curl_close($ch);

												if ($httpCode == 200) {
													$locationData = json_decode($response, true);
													$address = $locationData['display_name'] ?? 'Address not found';
												}

												echo "<td>" . $address . "</td>";
												echo "<td><img src='" . $row["gambar"] . "' alt='Gambar Ambulans' width='100'></td>";
												echo "<td>" . $row["status"] . "</td>";
												echo "</tr>";
											}
										} else {
											echo "<tr><td colspan='7'>No ambulances found</td></tr>";
										}
										
										?>
									</table>
									<br>
									<center>
										<Button onclick="location.href='add_ambulance.php'">Tambahkan Ambulans</Button>
									</center>
									
									
								</div>
								<br>
								<br>
								<h4>Data Sopir</h4>
								
								<div class="ui tall stacked segment">
									<a class="ui blue ribbon label">Daftar Sopir</a>
									<table border="1" width="100%">
										<tr>
											<th>ID Sopir</th>
											<th>Nama Sopir</th>
											<th>email</th>
											<th>no_hp</th>
											
										</tr>
										<?php
										if ($result3->num_rows > 0) {
											// Output data of each row
											while($row = $result3->fetch_assoc()) {
												echo "<tr>";
												echo "<td>" . $row["id"] . "</td>";
												echo "<td>" . $row["nama"] . "</td>";
												echo "<td>" . $row["email"] . "</td>";
												echo "<td>" . $row["no_hp"] . "</td>";
												
												echo "</tr>";
											}
										} else {
											echo "<tr><td colspan='7'>No sopir found</td></tr>";
										}
										
										?>
									</table>
									<br>
									<center>
										<Button onclick="location.href='add_sopir.php'">Tambahkan Sopir</Button>
									</center>
									
									
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- END CONTENT -->
		<!-- Modal HTML -->
		<!-- Modal HTML -->
		<div id="myModal" class="modal">
			<div class="modal-content">
				<span class="close">&times;</span>
				<form id="selectDriverForm" action="process_order.php" method="POST">
					<input type="text" name="kode_order" id="modal-kode-order">
					<input type="text" name="id_pemesan" id="modal-id-pemesan">
					<input type="text" name="status" id="modal-status">
					<label for="driver">Pilih Sopir:</label>
					<select name="id_sopir" id="driver">
						<!-- Options will be populated dynamically using JavaScript -->
					</select>
					<br>
					<button type="submit">Simpan</button>
				</form>
			</div>
		</div>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script>
		$(document).ready(function() {
			// Open modal when Terima button is clicked
			$('.terima-btn').click(function() {
				var kodeOrder = $(this).data('kode-order');
				var idPemesan = $(this).data('id-pemesan');
				var status = $(this).data('status');

				$('#modal-kode-order').val(kodeOrder);
				$('#modal-id-pemesan').val(idPemesan);
				$('#modal-status').val(status);

				// Call function to populate drivers in select dropdown
				populateDrivers();

				// Display modal
				$('#myModal').show(); // Use .show() instead of .css('display', 'block')
			});

			// Close modal when close button or outside modal is clicked
			$('.close, .modal').click(function(event) {
				if (event.target === this || $(event.target).hasClass('close')) {
					$('#myModal').hide(); // Use .hide() to hide modal
				}
			});

			// Function to populate drivers in select dropdown
			function populateDrivers() {
				$.ajax({
					url: 'get_drivers.php', // PHP script to fetch drivers
					type: 'GET',
					success: function(response) {
						$('#driver').html(response);
					},
					error: function(xhr, status, error) {
						console.error('Error fetching drivers:', error);
					}
				});
			}
		});
		</script>


		<!-- Modal HTML -->
		<!-- Modal HTML -->
		<div id="myModal2" class="modal">
			<div class="modal-content">
				<span class="close">&times;</span>
				<form id="selectDriverForm" action="reject_order.php" method="POST">
					<input type="hidden" name="kode_order" id="modal-kode-order2">
					<label for="alasan">Alasan:</label>
					<select name="alasan" id="alasan">
						<option value="Ambulans tidak tersedia">Ambulans tidak tersedia</option>
						<option value="Sopir tidak tersedia">Sopir tidak tersedia</option>
						<option value="Petugas ambulans tidak tersedia">Petugas ambulans tidak tersedia</option>
					</select>
					<br>
					<button type="submit">Simpan</button>
				</form>
			</div>
		</div>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script>
		$(document).ready(function() {
			// Open modal when Terima button is clicked
			$('.tolak-btn').click(function() {
				var kodeOrder = $(this).data('kode-order2');
				$('#modal-kode-order2').val(kodeOrder);

				// Display modal
				$('#myModal2').show(); // Use .show() instead of .css('display', 'block')
			});

			// Close modal when close button or outside modal is clicked
			$('.close, .modal').click(function(event) {
				if (event.target === this || $(event.target).hasClass('close')) {
					$('#myModal2').hide(); // Use .hide() to hide modal
				}
			});

			
		});
		</script>


	</div>
</body>
<!-- inject:js -->
<script src="vendors/jquery/jquery.min.js"></script>
<script src="vendors/fomantic-ui/semantic.min.js"></script>
<script src="js/main.js"></script>
<!-- endinject -->
<!-- chartjs:js -->
<script src="vendors/chart.js/Chart.min.js"></script>
<script src="vendors/chart.js/Chart.utils.js"></script>
<script src="vendors/chart.js/Chart.example.js"></script>
<!-- endinject -->
</html>