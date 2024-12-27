import { IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';

export default function NotifDriver({ navigation, route }) {
  const { id } = route.params;
  const { notif } = route.params;
  const [newNotif, setNewNotif] = useState(null);
  const [newUnread, setNewUnread] = useState(null);

  const updateNotif = async () => {
    if (!id) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/update_notif_driver.php', { id });
      console.log('Data yang dikirim:', { id });
      console.log('Response:', response.data);

      if (response.data.success) {
        console.log('Sukses', response.data.message);
        fetchNotif();
      } else {
        console.log('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  useEffect(() => {
    updateNotif();
  }, [id]);

  const fetchNotif = async () => {
    if (!id) {
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/get_notif_driver.php', {
        id
      });
      console.log('Data yang dikirim:', { id,});

      console.log('Response:', response.data);

      if (response.data.success) {
        setNewNotif(response.data.notif);
        setNewUnread(response.data.unread);
      } else {
        console.log('Error', response.data.message);
        
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };


  return (
    <ScrollView>
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.navigate('HomeDriver', {notif: newNotif, unread: newUnread, id})}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Notifikasi', style: { color: '#fff', fontSize: 22 } }}
      />
      <View style={styles.container}>
        {Array.isArray(notif) && notif.length > 0 ? (
          notif.map((notifs, index) => (
            <View style={styles.dataContainer} key={index}>
              <View style={styles.data}>
                <View style={styles.dataText}>
                  <Text style={styles.dataTitle}>{notifs.order_status}</Text>
                  <View style={{ paddingBottom: 10 }}>
                    <View style={{width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>{notifs.pesan}</Text>
                      </View>
                    </View>
                    <View style={{width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={[styles.desc, {textAlign: "right", color: "black", paddingTop: 7}]}>{notifs.waktu}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>Tidak ada notifikasi yang ditemukan.</Text>
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
    padding: 5,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#BABCCA",
  },
  data: {
    padding: 10,
    paddingTop: 20,
    flexDirection: "row",
    width: "100%",
  },
  dataText: {
    width: "100%"
  },
  dataTitle: {
    fontSize: 22,
    color: "#14A44D",
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  descCol: {
    
    padding: 5,
    width: "100%"
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
