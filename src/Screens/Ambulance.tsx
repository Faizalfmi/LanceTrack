import { IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';

export default function Ambulance({ navigation }) {
  const [ambulances, setAmbulances] = useState([]);

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    try {
      const response = await axios.get('https://91a7-125-164-23-22.ngrok-free.app/api/get_all_ambulances.php');

      console.log('Response:', response.data);

      if (response.data.success) {
        setAmbulances(response.data.data);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching ambulances:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  return (
    <ScrollView>
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Daftar Ambulans', style: { color: '#fff', fontSize: 22 } }}
      />
      <View style={styles.container}>
        {ambulances.map((ambulance) => (
          <TouchableOpacity
            key={ambulance.id_ambulans}
            style={styles.dataContainer}
            onPress={() => navigation.navigate('Detail', { ambulance })}
          >
            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  {ambulance.nama}
                </Text>
                <View>
                  <Text style={styles.dataInside}>
                    Tipe: {ambulance.tipe}
                  </Text>
                  <Text style={styles.dataInside}>
                    Kondisi: {ambulance.status === "0" ? 'Tersedia' : 'Tidak Tersedia'}
                  </Text>
                </View>
              </View>
              <View style={styles.conditionContainer}>
                <TouchableOpacity style={[styles.conditionButton, { backgroundColor: ambulance.status === '0' ? '#85DD00' : '#E64848' }]}>
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {ambulance.status === "0" ? 'Tersedia' : 'Tidak Tersedia'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.data, { paddingTop: 55, paddingLeft: 15, flexDirection: "column" }]}>
              <Image source={{ uri: `https://91a7-125-164-23-22.ngrok-free.app/frontend/web/upload/${ambulance.gambar}` }} style={{ width: 140, height: 100, borderRadius: 15 }} />
              {/* <Text style={{ textAlign: "center", padding: 10 }}>4,2km</Text> */}
            </View>
          </TouchableOpacity>
        ))}
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
    backgroundColor: 'white',
  },
  dataContainer: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BABCCA',
    
  },
  data: {
    padding: 10,
    paddingTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
  },
  dataText: {
    flex: 1,
    paddingLeft: 10,
  },
  dataTitle: {
    fontSize: 24,
    color: '#000',
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  dataInside: {
    fontSize: 16,
    color: '#555555',
  },
  conditionContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingTop: 30,
    alignSelf: "flex-start"
    
  },
  conditionButton: {
    backgroundColor: '#85DD00',
    width: "auto",
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 15,
  },
  distanceText: {
    textAlign: 'center',
    padding: 10,
  },
});
