import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Overlay, Tab, TabView } from '@rneui/themed';
import axios from 'axios';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert, ImageBackground, RefreshControl } from 'react-native';
import Swiper from 'react-native-swiper';

type OverlayComponentProps = {};

const HomeUser: React.FunctionComponent<OverlayComponentProps> = ({navigation, route}) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [notif, setNotif] = useState(null);
  const [unread, setUnread] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Panggil fungsi untuk mendapatkan data terbaru
    fetchData().then(() => {
      setIsRefreshing(false); // Set isRefreshing ke false setelah data diperbarui
    });
  }, []);

  const fetchData = () => {
    return new Promise((resolve, reject) => {
      fetchNotif();
      fetchOrderDetails();
      checkLoginStatus();
      resolve(); // Resolusi Promise setelah semua fungsi selesai dijalankan
    });
  };

  useEffect(() => {
    // Set interval untuk refresh data setiap 10 detik
    const interval = setInterval(fetchData, 10000); // 10000 ms = 10 detik

    // Bersihkan interval saat komponen unmount
    return () => clearInterval(interval);
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUserName = await AsyncStorage.getItem('userName');
      const storedUserData = await AsyncStorage.getItem('userData');

      if (userToken && storedUserName && storedUserData) {
        setIsLoggedIn(true);
        setUserName(storedUserName);
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setId(parsedUserData.id);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const fetchOrderDetails = async () => {
    if (!id) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/getOrder2.php', {
        id
      });
      console.log('Data yang dikirim:', { id });

      console.log('Response:', response.data);

      if (response.data.success) {
        setOrderDetails(response.data.order);
      } else {
        setOrderDetails(null);
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
        setNotif(response.data.notif);
        setUnread(response.data.unread);
      } else {
        console.log('Error', response.data.message);
        
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchNotif();
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
      fetchNotif();
    }, [])
  );

  const [visible1, setVisible1] = useState(false);
    
    const toggleOverlay1 = () => {
      setVisible1(!visible1);
    };

    useFocusEffect(
      useCallback(() => {
        checkLoginStatus();
        if (route.params?.notif) {
          setNotif(route.params.notif);
        }
        if (route.params?.unread) {
          setUnread(route.params.unread);
        }
        if (route.params?.orderDetails) {
          setOrderDetails(route.params.orderDetails);
        }
      }, [route.params])
    );

  return (
    <ScrollView
    style={{backgroundColor: "white"}}
    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
    <View style={styles.container}>

        {/* Card welcome dan notification */}
        <View style={styles.nameContainer}>
            {isLoggedIn ? (
            <Text style={styles.name}>Hi, {userName}</Text>
            ) : (
            <Text style={[styles.name, {textDecorationLine: 'underline'}]} onPress={() => navigation.navigate('LoginUser')}> Login </Text>
            )}
            
            <TouchableOpacity onPress={() => navigation.navigate("NotifDriver", { notif, id, })}>
              <View style={styles.iconContainer}>
              {isLoggedIn ? (
                  <ImageBackground
                      source={require('./resource/img/notif.png')}
                      style={{ height: 35, width: 35 }}>
                        {unread > 0 && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unread}</Text>
                          </View>
                        )}
                    
                  </ImageBackground>
              ):(
                <ImageBackground
                      source={require('./resource/img/notif.png')}
                      style={{ height: 35, width: 35 }}></ImageBackground>
              )}
                  
              </View>
            </TouchableOpacity>
        </View>

        {/* Swiper gambar ambulans */}
        <View style={styles.orderContainer}>
            <Text style={styles.title}>Pesanan Aktif</Text>
            <View style={styles.orderShadow}>
                {orderDetails ? (
                  <View style={styles.order}>
                    <View style={{flexDirection: "row", width: "100%", padding:8, paddingTop:15}}>
                        <View style={{width: "50%"}}>
                            <Text style={styles.desc}>Kode pemesanan</Text>
                            <Text style={styles.desc}>Nama pemesan</Text>
                            <Text style={styles.desc}>Nama ambulans</Text>
                            <Text style={styles.desc}>Kondisi pasien</Text>
                        </View>
                        <View style={{width: "50%"}}>
                            <Text style={styles.desc}>: {orderDetails.kode}</Text>
                            <Text style={styles.desc}>: {orderDetails.pemesan}</Text>
                            <Text style={styles.desc}>: {orderDetails.ambulans}</Text>
                            <Text style={styles.desc}>: {orderDetails.kondisi}</Text>
                        </View>
                    </View>

                    <View style={{padding:10}}>
                        <TouchableOpacity style={[styles.tombol, {backgroundColor: "#14A44D"}]}
                        onPress={() => navigation.navigate('TrackDriver', {orderDetails, id})}>
                            <Text style={styles.textTombol}>Lihat Lokasi</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.order}>
                    <View style={{paddingHorizontal: 20, paddingTop: 25, paddingBottom: 10,}}>
                      <Text style={{fontSize: 16}}>Belum ada pesanan ...</Text>
                    </View>
                    <View style={{alignSelf: "center"}}>
                      <Image source={require('./resource/img/sleeping.png')} style={{width:130, height:130}}></Image>
                    </View>
                  </View>
                )}
            </View>
        </View>
      
        {/* Container tombol menu */}
        <View style={styles.buttonsection}>

            {/* Baris 2 tombol menu */}
            <View style={styles.buttonsContainer}>

                <TouchableOpacity style={styles.buttonTextContainer}
                onPress={() => navigation.navigate('HistoryDriver', {id})}>
                <View style={styles.button}>
                <Image source={require('./resource/img/riwayat.png')} style={styles.buttonIcon}></Image>
                </View>
                <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.buttonTextContainer}
                onPress={() => navigation.navigate('ProfileDriver', { userData })}>
                <View style={styles.button}>
                <Image source={require('./resource/img/profile.png')} style={styles.buttonIcon}></Image>
                </View>
                <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
            
            </View>

        </View>

        
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: 'center',
    padding: 16,
    backgroundColor: "white",
    paddingTop: 25,
    justifyContent: "flex-start"
  },
  nameContainer: {
    width: "97%",
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
    padding: 30,
    backgroundColor: '#14A44D',
    borderRadius: 20,
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  orderContainer: {
    width:"95%",
    height: 180, 
    borderRadius:20,
  },
  orderShadow: {
    alignSelf: "center",
    width: "95%",
    height: 200,
    backgroundColor: "#d4d6d4",
    borderRadius: 20,
  },
  order: {
    width: "99%",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    height: 193,
    backgroundColor: "white",
    alignSelf: "center",
    verticalAlign: "top"
  },
  tombol: {
    alignSelf: "center",
    borderRadius: 50,
    width: 130,
    height: 40,
    justifyContent: "center"
  },
  textTombol: {
    textAlign: "center",
    color: "white"
  },
  buttonsection: {
    paddingTop: 180,
    width: "100%"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", 
    alignSelf: "center",
    paddingTop: 30,
    width: "70%"
  },
  buttonTextContainer: {
    flexDirection: "column"
  },
  button: {
    width: 70,
    height: 70,
    backgroundColor: "#14A44D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50
  },
  buttonText: {
    textAlign: "center",
    padding:8,
    color: "#555555"
  },
  buttonIcon: {
    height: 45,
    width:45,
  },
  title: {
    color: "#000",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
    padding: 10,
    paddingTop: 90
  },
  desc: {
    padding:3,
    fontSize:14,
  },
  iconContainer: {
    flexDirection: 'row'
},
badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "flex-end"
},
badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
}
});

export default HomeUser;
