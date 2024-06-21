import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';

const Track = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');

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
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        onMessage={handleMessage}
      />
      <View style={styles.inputContainer}>
        <Text>Selected Location:</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={location.lat ? location.lat.toString() : ''}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={location.lng ? location.lng.toString() : ''}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          editable={false}
        />
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default Track;
