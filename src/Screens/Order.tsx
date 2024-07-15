import { IconOutline } from '@ant-design/icons-react-native';
import { Header } from '@rneui/base';
import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const Order = ({ navigation, route }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  const { userData } = route.params;
  const { id } = userData;
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [kondisi, setKondisi] = useState('');

  const handleMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setLocation(data);
    const address = await getAddress(data.lat, data.lng);
    setAddress(address);
    setLat(data.lat);
    setLng(data.lng);
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

  //order
  const handleOrder = async () => {
    try {
      // Debugging untuk memastikan data yang dikirim tidak null
      console.log('Data yang dikirim:', { id, lat, lng, kondisi });

      // Memastikan data tidak null sebelum mengirimkan permintaan
      if (id && lat !== null && lng !== null) {
        const response = await axios.post('http://10.0.2.2/ambulance/order.php', {
          id,
          lat,
          lng,
          kondisi
        });

        if (response.data.success) {
          Alert.alert('Pemesanan Berhasil', response.data.message);
          navigation.navigate('Home');
        } else {
          Alert.alert('Pemesanan Gagal', response.data.message);
        }
      } else {
        Alert.alert('Error', 'Data incomplete. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  const mapHtml = `
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
            var map = L.map('map').setView([-6.917464, 107.619123], 13); // Bandung, Indonesia
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var currentMarker;

            function onMapClick(e) {
              if (currentMarker) {
                map.removeLayer(currentMarker);
              }
              currentMarker = L.marker(e.latlng).addTo(map);
              window.ReactNativeWebView.postMessage(JSON.stringify(e.latlng));
            }
            map.on('click', onMapClick);
          }
        </script>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script>
          document.addEventListener('DOMContentLoaded', initMap);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
        <Header
          backgroundColor="#FF6F6F"
          leftComponent={
            <TouchableOpacity
            onPress={() => navigation.goBack()}>
              <IconOutline name="arrow-left" color="white" size={25}/>
            </TouchableOpacity>
          }
          centerComponent={{ text: 'Pemesanan', style: { color: '#fff', fontSize: 22} }}
          
        />
        <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.webview}
            onMessage={handleMessage}
        />
        <View style={styles.inputContainer}>
            <Text style={styles.title}>Form Pemesanan Ambulans</Text>
            <Text style={styles.inputText}>Lokasi Pasien</Text>
            
            <TextInput
            style={styles.input}
            placeholder="Pilih dari peta..."
            value={address}
            editable={false}
            />

            <Text style={styles.inputText}>Lokasi Pasien</Text>
            <TextInput
            style={styles.input}
            placeholder="Masukkan kondisi pasien..."
            onChangeText={text => setKondisi(text)}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity  style={styles.button}
                onPress={handleOrder}>
                    <Text style={styles.buttonText}>Pesan</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    
    width: "100%",
    bottom: 0
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    paddingBottom: 15
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 5
  },
  inputText: {
    fontSize: 16,
    padding: 5
  },
  buttonContainer: {
    width: "90%",
    alignContent: "center",
    alignSelf: "center",
    paddingVertical:15
  },
  button:{
    backgroundColor: "#FF6F6F",
    width: "90%",
    height: 50,
    alignSelf: "center",
    borderRadius: 50,
    justifyContent: "center"
  },
  buttonText:{
    textAlign: "center",
    color: "white",
    fontSize:22
  },
});

export default Order;
