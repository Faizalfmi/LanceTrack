import { IconOutline } from "@ant-design/icons-react-native";
import { Header, Button } from "@rneui/base";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';

export default function History({ navigation, route }) {
  const { id } = route.params;
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    if (!id) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/get_history.php', { id });
      console.log('Data yang dikirim:', { id });
      console.log('Response:', response.data);

      if (response.data.success) {
        if (Array.isArray(response.data.order)) {
          setHistory(response.data.order);
        } else {
          console.error('Response order is not an array');
        }
      } else {
        console.log('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  return (
    <ScrollView>
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Riwayat', style: { color: '#fff', fontSize: 22 } }}
      />
      <View style={styles.container}>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((riwayat, index) => (
            <View style={styles.dataContainer} key={index}>
              <View style={styles.data}>
                <View style={styles.dataText}>
                  <Text style={styles.dataTitle}>{riwayat.ambulans}</Text>
                  <View style={{ paddingBottom: 10 }}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>Sopir ambulans</Text>
                      </View>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>: </Text>
                        <Text style={styles.desc}>{riwayat.sopir}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>Waktu pemesanan</Text>
                      </View>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>: </Text>
                        <Text style={styles.desc}>{riwayat.waktu}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.reviewContainer}>
              <Button
                disabled={riwayat.review_count > 0}
                buttonStyle={styles.reviewButton}
                onPress={() => navigation.navigate('Review', { id, riwayat })}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Ulas</Text>
              </Button>

              </View>
            </View>
          ))
        ) : (
          <Text>Tidak ada riwayat yang ditemukan.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'white'
  },
  dataContainer: {
    width: "100%",
    padding: 20,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#BABCCA",
  },
  data: {
    padding: 10,
    paddingTop: 30,
    flexDirection: "row",
    width: "100%",
  },
  dataText: {
    width: "100%"
  },
  dataTitle: {
    fontSize: 24,
    color: "#000",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  descCol: {
    flexDirection: "row",
    width: "50%",
    padding: 3
  },
  desc: {
    fontSize: 16
  },
  reviewContainer: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
  },
  reviewButton: {
    backgroundColor: "#14A44D",
    width: 110,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  }
});
