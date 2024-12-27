import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Clipboard, Alert, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { IconOutline } from '@ant-design/icons-react-native';
import { Header } from '@rneui/base';

const Track = ({ navigation, route }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const { id, id_ambulans } = route.params;
  const [ambu, setAmbu] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrderDetails = async () => {
    if (!id) {
      console.log('ID is not set');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/getOrder.php', { id });
      console.log('Response:', response.data);

      if (response.data.success) {
        setOrderDetails(response.data.order);
      } else {
        console.log('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // Fungsi untuk melakukan refresh
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Panggil fungsi untuk mendapatkan data terbaru
    fetchData().then(() => {
      setIsRefreshing(false); // Set isRefreshing ke false setelah data diperbarui
    });
  }, []);

  const fetchData = () => {
    return new Promise((resolve, reject) => {
      fetchAmbulance();
      fetchOrderDetails();
      resolve(); // Resolusi Promise setelah semua fungsi selesai dijalankan
    });
  };

  useEffect(() => {
    // Set interval untuk refresh data setiap 10 detik
    const interval = setInterval(fetchData, 10000); // 10000 ms = 10 detik

    // Bersihkan interval saat komponen unmount
    return () => clearInterval(interval);
  }, []);

  const handleMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setLocation(data);
    const address = await getAddress(data.lat, data.lng);
    setAddress(address);
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const json = await response.json();
      return json.display_name;
    } catch (error) {
      console.error(error);
      return 'Unable to fetch address';
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(orderDetails.kode);
    Alert.alert('Copied to Clipboard', 'The text has been copied to your clipboard.');
  };

  const fetchAmbulance = async () => {
    if (!id_ambulans) {
      console.error('Ambulance ID is not set');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/getAmbulance.php', { id_ambulans });
      console.log('Response:', response.data);

      if (response.data.success) {
        setAmbu(response.data.data);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching ambulance details:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  useEffect(() => {
    if (id_ambulans) {
      fetchAmbulance();
    }
  }, [id_ambulans]);

  const mapHtml = ambu ? `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body, html, #map {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          var map = L.map('map').setView([${ambu.lat}, ${ambu.lon}], 17); // Gunakan koordinat dari ambu
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Definisikan ikon kustom
          var customIcon = L.icon({
            iconUrl: 'https://img.icons8.com/color/48/ambulance.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
          });

          // Tambahkan pin dengan ikon kustom
          var marker = L.marker([${ambu.lat}, ${ambu.lon}], { icon: customIcon }).addTo(map);
          marker.bindPopup('<b>Lokasi Ambulans</b><br>${ambu.address}').openPopup();
        }
      </script>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script>
        document.addEventListener('DOMContentLoaded', initMap);
      </script>
    </body>
  </html>
` : '';

  return (
    <ScrollView 
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      style={styles.container}
    >
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Pelacakan', style: { color: '#fff', fontSize: 22 } }}
      />
      {ambu ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={styles.webview}
          onMessage={handleMessage}
        />
      ) : (
        <View style={{ width: "100%", height:500, justifyContent: "center", alignContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" />
          <Text>Loading map...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Informasi Pemesanan</Text>
        {orderDetails ? (
          <>
            <View style={styles.kodeContainer}>
              <Text style={styles.kode}>{orderDetails.kode}</Text>
              <TouchableOpacity onPress={copyToClipboard} style={{ paddingHorizontal: 10 }}>
                <IconOutline name="copy" size={24} color="grey" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.descCol}>
                <Text style={styles.desc}>Lokasi jemput</Text>
              </View>
              <View style={styles.descCol}>
                <Text style={styles.desc}>: </Text>
                <Text style={styles.desc}>{orderDetails.address}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.descCol}>
                <Text style={styles.desc}>Sopir ambulans</Text>
              </View>
              <View style={styles.descCol}>
                <Text style={styles.desc}>: </Text>
                <Text style={styles.desc}>{orderDetails.sopir}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.descCol}>
                <Text style={styles.desc}>Waktu pemesanan</Text>
              </View>
              <View style={styles.descCol}>
                <Text style={styles.desc}>: </Text>
                <Text style={styles.desc}>{orderDetails.waktu}</Text>
              </View>
            </View>
            <View style={{ padding: 15 }}>
              <Text style={{ textAlign: "center", fontSize: 16, color: "black", fontWeight: "bold" }}>Status</Text>
              <Text style={{ textAlign: "center", fontSize: 18, color: "#14A44D", fontWeight: "bold" }}>
                {orderDetails.status}
              </Text>
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  webview: {
    flex: 1,
    width: "100%",
    height: 440
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    width: "95%",
    alignSelf: "center"
  },
  title: {
    fontSize: 22,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    padding: 10
  },
  kodeContainer: {
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  kode: {
    fontSize: 18
  },
  descCol: {
    flexDirection: "row", width: "50%",
    padding: 3
  },
  desc: {
    fontSize: 16
  }
});

export default Track;
