import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Clipboard, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { IconOutline } from '@ant-design/icons-react-native';
import { Header } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';

const Track = ({ navigation, route }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  const [orderDetails, setOrderDetails] = useState(route.params.orderDetails);
  const { id } = route.params;
  const [ orderDetails2, setOrderDetails2 ] = useState(null);
  const { kode } = orderDetails;
  const { id_pemesan } = orderDetails;
  const [selectedValue, setSelectedValue] = useState(orderDetails.status);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh) {
      // Reload the current screen
      fetchOrderDetails;
      navigation.navigate('TrackDriver', { orderDetails: orderDetails2 });
      setRefresh(false);
    }
  }, [refresh]);

  const fetchOrderDetails = async () => {
    if (!id) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await axios.post('https://91a7-125-164-23-22.ngrok-free.app/api/getOrder2.php', {
        id
      });
      console.log('Data yang dikirim:', { id });

      console.log('Response:', response.data);

      if (response.data.success) {
        setOrderDetails2(response.data.order);
      } else {
        setOrderDetails2(null);
        console.log('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

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

  const handleValueChange = async (itemValue) => {
    setSelectedValue(itemValue);
    await handleStatus(itemValue); // Ensure handleStatus is called with new value
  };

  const handleStatus = async (status) => {
    try {
      console.log('Data yang dikirim:', { kode, status, id_pemesan });

      if (kode !== null && status !== null) {
        const response = await axios.post('https://91a7-125-164-23-22.ngrok-free.app/api/change_status.php', {
          kode,
          status,
          id_pemesan
        });

        if (response.data.success) {
          Alert.alert('Status diubah', response.data.message);
          setRefresh(true); // Trigger a refresh
          if (selectedValue === "Selesai") {
            navigation.navigate('HomeDriver', {orderDetails: orderDetails2})
          }
        } else {
          Alert.alert('Perubahan Gagal', response.data.message);
        }
      } else {
        Alert.alert('Error', 'Data incomplete. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  const mapHtml = orderDetails ? `
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
          var map = L.map('map').setView([${orderDetails.lat}, ${orderDetails.lon}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          var customIcon = L.icon({
            iconUrl: 'https://img.icons8.com/external-konkapp-flat-konkapp/64/external-patient-virus-transmission-konkapp-flat-konkapp.png',
            iconSize: [45, 45],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
          });

          var marker = L.marker([${orderDetails.lat}, ${orderDetails.lon}], { icon: customIcon }).addTo(map);
          marker.bindPopup('<b>Lokasi Pasien</b><br>${orderDetails.address}').openPopup();
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
    <View style={styles.container}>
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Pelacakan', style: { color: '#fff', fontSize: 22 } }}
      />
      {orderDetails ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={styles.webview}
          onMessage={handleMessage}
        />
      ) : (
        <Text>Loading map...</Text>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Informasi Pemesanan</Text>
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
          <View style={styles.descCol2}>
            <Text style={styles.desc}>:  </Text>
            <Text style={styles.desc}>{orderDetails.address}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.descCol}>
            <Text style={styles.desc}>Nama pemesan</Text>
          </View>
          <View style={styles.descCol2}>
            <Text style={styles.desc}>:  </Text>
            <Text style={styles.desc}>{orderDetails.pemesan}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.descCol}>
            <Text style={styles.desc}>Waktu pemesanan</Text>
          </View>
          <View style={styles.descCol2}>
            <Text style={styles.desc}>:  </Text>
            <Text style={styles.desc}>{orderDetails.waktu}</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingBottom: 10, width: "100%", alignItems: "center"}}>
        <Text style={{ textAlign: "center", fontSize: 16, color: "black", fontWeight: "bold", padding:5 }}>Status</Text>
        <TouchableOpacity style={styles.button}>
          <Picker
            selectedValue={selectedValue}
            style={{ height: 50, width: 250, color: "white" }}
            onValueChange={(itemValue) => handleValueChange(itemValue)}
          >
            <Picker.Item label="Diterima" value="Diterima"/>
            <Picker.Item label="Menunggu Ambulans" value="Menunggu Ambulans Berangkat" />
            <Picker.Item label="Menuju Lokasi Pasien" value="Menuju Lokasi Pasien" />
            <Picker.Item label="Tiba di Lokasi Pasien" value="Tiba di Lokasi Pasien" />
            <Picker.Item label="Menuju Rumah Sakit" value="Menuju Rumah Sakit" />
            <Picker.Item label="Sampai di Rumah Sakit" value="Sampai di Rumah Sakit" />
            <Picker.Item label="Selesai" value="Selesai" />
          </Picker>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  webview: {
    flex: 1,
  },
  inputContainer: {
    padding: 10,
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
    flexDirection: "row", width: "40%",
    padding: 3
  },
  descCol2: {
    flexDirection: "row", width: "60%",
    padding: 3
  },
  desc: {
    fontSize: 16
  },
  button: {
    width: "auto",
    backgroundColor: "#14A44D",
    borderRadius:20,
    paddingHorizontal: 20,
    height:40,
    justifyContent: "center"
  },
  buttonText: {
    color: 'white'
  }
});

export default Track;
