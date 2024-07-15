import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Overlay, Tab, TabView } from '@rneui/themed';
import axios from 'axios';
import { Component, useCallback, useEffect } from 'react';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native';
import Swiper from 'react-native-swiper';

type OverlayComponentProps = {};

const HomeUser: React.FunctionComponent<OverlayComponentProps> = ({navigation, route}) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderDetails2, setOrderDetails2] = useState(null);
  const [orderCode, setOrderCode] = useState('');

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

  const fetchOrderDetails = async () => {
    if (!id) {
      console.error('User ID is not set');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2/ambulance/getOrder.php', {
        id
      });
      console.log('Data yang dikirim:', { id,});

      console.log('Response:', response.data);

      if (response.data.success) {
        setOrderDetails(response.data.order);
        setId(response.data.order.id)
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

  const checkOrderCode = async () => {
    if (!orderCode) {
      console.error('User ID is not set');
      return;
    }
  
    try {
      const response = await axios.post('http://10.0.2.2/ambulance/check_order_code.php', {
        orderCode
      });
  
      console.log('Response:', response.data);
  
      if (response.data.success) {
        setOrderDetails2(response.data.order);
        Alert.alert('Pesanan tersedia', 'Pesanan dengan kode pemesanan yang anda berikan tersedia');
        
        // Navigate to the Track page
        navigation.navigate('Track', {
          orderDetails: response.data.order, // Use response.data.order instead of orderDetails2
          id_ambulans: response.data.order.id_ambulans
        });
      } else {
        console.log('Error', response.data.message);
        Alert.alert('Pesanan tidak ditemukan', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };
  

  const checkOrderData = async () => {
    
      if (orderDetails) {
        setId(orderDetails.id)
      } else {
        return
      }
    
  };

  useEffect(() => {
    checkOrderData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
      
    }, [])
  );



  // Image Swiper
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex) % images.length);
    }, ); 

    return () => clearInterval(interval); // Bersihkan interval saat komponen tidak lagi digunakan
  }, []); // Efek hanya dijalankan sekali setelah komponen pertama kali dimuat

  const images = [
    require('./resource/img/ambulans.jpeg'),
    require('./resource/img/ambulans2.webp'),
    require('./resource/img/ambulans3.jpeg'),
  ];

  // Overlay
  
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    
    const toggleOverlay1 = () => {
      setVisible1(!visible1);
    };

    const toggleOverlay2 = () => {
      setVisible2(!visible2);
    };

    //Tab
    const [tabIndex, setTabIndex] = React.useState(0);

    // navigasi ke track + toggle overlay
    const handleNavigationAndToggle = () => {
      // Toggle the overlay
      setVisible2(!visible2);
  
      // Navigate to the Track page
      navigation.navigate('Track', {
        orderDetails, id_ambulans: orderDetails.id_ambulans
      })};
  
  return (
    <View style={styles.container}>

      {/* Card welcome dan notification */}
      <View style={styles.nameContainer}>
        {isLoggedIn ? (
          <Text style={styles.name}>Hi, {userName}</Text>
        ):(
          <Text style={[styles.name, {textDecorationLine: 'underline'}]} onPress={() => navigation.navigate('LoginUser')}> Login </Text>
        )}
        
        <Image source={
            require('./resource/img/icons8-notification-100.png')}
            style={{height:35, width:35}}></Image>
      </View>

      <View style={[styles.logo, {paddingVertical:60}]}>
        <Image source={
              require('./resource/img/logo.jpeg')}
              style={styles.logo}></Image>
      </View>
      
      {/* Swiper gambar ambulans */}
      <View style={styles.imageContainer}>
        <Swiper
          autoplay
          autoplayTimeout={3}
          showsPagination={false}
          
          onIndexChanged={(index) => setCurrentImageIndex(index)}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.slide}>
              <Image source={image} style={styles.image} />
            </View>
          ))}
        </Swiper>
        <View style={styles.dotContainer}>
          {images.map((_, index) => (
            <View key={index} style={[styles.dot, currentImageIndex === index ? styles.activeDot : null]} />
          ))}
        </View>
      </View>
      
      {/* Container tombol menu */}
      <View style={styles.buttonsection}>

        {/* Baris 1 tombol menu */}
        <View style={styles.buttonsContainer}>
        {isLoggedIn ? (
          <TouchableOpacity
           onPress={() => navigation.navigate('Order', { userData })}
           style={styles.buttonTextContainer}>
            <View style={styles.button}>
            <Image source={
                  require('./resource/img/pesan.png')}
                  style={styles.buttonIcon}></Image>
            </View>
            <Text style={styles.buttonText}>
              Pesan
            </Text>
          </TouchableOpacity>
        ):(
          <TouchableOpacity 
            onPress={toggleOverlay1}
            style={styles.buttonTextContainer}>
              <View style={styles.button}>
              <Image source={
                    require('./resource/img/pesan.png')}
                    style={styles.buttonIcon}></Image>
              </View>
              <Text style={styles.buttonText}>
                Pesan
              </Text>
            </TouchableOpacity>
          
        )}

          {isLoggedIn ? (
            <TouchableOpacity 
            onPress={toggleOverlay2}
            style={styles.buttonTextContainer}>
              <View style={styles.button}>
              <Image source={
                    require('./resource/img/track.png')}
                    style={styles.buttonIcon}></Image>
              </View>
              <Text style={styles.buttonText}>
                Track
              </Text>
            </TouchableOpacity>
          ):(
            <TouchableOpacity 
          onPress={toggleOverlay1}
          style={styles.buttonTextContainer}>
            <View style={styles.button}>
            <Image source={
                  require('./resource/img/track.png')}
                  style={styles.buttonIcon}></Image>
            </View>
            <Text style={styles.buttonText}>
              Track
            </Text>
          </TouchableOpacity>
          )}
          
          {isLoggedIn ? (
          <TouchableOpacity style={styles.buttonTextContainer}
          onPress={() => navigation.navigate('Ambulan')}>
            <View style={styles.button}>
            <Image source={
                  require('./resource/img/ambuicon.png')}
                  style={styles.buttonIcon}></Image>
            </View>
            <Text style={styles.buttonText}>
              Ambulan
            </Text>
          </TouchableOpacity>
          ):(
            <TouchableOpacity style={styles.buttonTextContainer}
            onPress={toggleOverlay1}>
            <View style={styles.button}>
            <Image source={
                  require('./resource/img/ambuicon.png')}
                  style={styles.buttonIcon}></Image>
            </View>
            <Text style={styles.buttonText}>
              Ambulan
            </Text>
          </TouchableOpacity>
          )}
        </View>

        {/* Baris 2 tombol menu */}
        <View style={styles.buttonsContainer}>
          {isLoggedIn ? (
            <TouchableOpacity style={styles.buttonTextContainer}
            onPress={() => navigation.navigate('History', {id: userData.id})}>
              <View style={styles.button}>
              <Image source={
                    require('./resource/img/riwayat.png')}
                    style={styles.buttonIcon}></Image>
              </View>
              <Text style={styles.buttonText}>
                History
              </Text>
            </TouchableOpacity>
          ):(
            <TouchableOpacity style={styles.buttonTextContainer}
          onPress={toggleOverlay1}>
            <View style={styles.button}>
            <Image source={
                  require('./resource/img/riwayat.png')}
                  style={styles.buttonIcon}></Image>
            </View>
            <Text style={styles.buttonText}>
              History
            </Text>
          </TouchableOpacity>
          )}

          {isLoggedIn ? (
            <TouchableOpacity style={styles.buttonTextContainer}
            onPress={() => navigation.navigate('Profile', { userData })}>
              <View style={styles.button}>
              <Image source={
                    require('./resource/img/profile.png')}
                    style={styles.buttonIcon}></Image>
              </View>
              <Text style={styles.buttonText}>
                Profile
              </Text>
            </TouchableOpacity>
          ):(
            <TouchableOpacity style={styles.buttonTextContainer}
          onPress={toggleOverlay1}>
            <View style={styles.button}>
            <Image source={
                  require('./resource/img/profile.png')}
                  style={styles.buttonIcon}></Image>
            </View>
            <Text style={styles.buttonText}>
              Profile
            </Text>
          </TouchableOpacity>
          )}
          

          <View style={styles.buttonTextContainer}>
            <View style={{width: 70,
              height: 70,
              backgroundColor: "white", 
              alignItems: "center",
              justifyContent: "center",}}>
            
            </View>
            <Text style={styles.buttonText}>
              
            </Text>
          </View>
        </View>

      </View>


      {/* Tampilan Overlay */}
      <Overlay isVisible={visible1} onBackdropPress={toggleOverlay1} overlayStyle={{width: "80%", borderRadius: 15, height:250, justifyContent: 'center'}}>
        <Text style={{fontWeight: "bold", fontSize: 24, textAlign: "center"}}>
          Anda belum login!!
        </Text>
        <Text style={{padding: 30, paddingBottom: 50, fontSize: 16,textAlign: "center"}}>
          Login ke akun anda terlebih dahulu untuk menggunakan fitur ini
        </Text>
        <Button buttonStyle={{width: 100, alignSelf: "center", borderRadius:10, backgroundColor: "#FF6F6F"}}
          title="Login"
          onPress={() => navigation.navigate('LoginUser')}
        />
      </Overlay>

      <Overlay isVisible={visible2} onBackdropPress={toggleOverlay2} overlayStyle={{width: "90%", height: 550, borderRadius: 20}}>
          <Tab
            value={tabIndex}
            onChange={(e) => setTabIndex(e)}
            indicatorStyle={{
              backgroundColor: '#FF6F6F',
              height: 4,
              
            }}
            
            variant="primary"
          >
          <Tab.Item
            title="Pesanan Saya"
            titleStyle={{ fontSize: 18 , color: tabIndex === 0 ? "#000" : "grey", fontWeight: tabIndex === 0 ? 'bold' : 'normal'}}
            buttonStyle={{backgroundColor: "#FFF" }}
          />
          <Tab.Item
            title="Pesanan Lain"
            titleStyle={{ fontSize: 18 , color: tabIndex === 1 ? "#000" : "grey", fontWeight: tabIndex === 1 ? 'bold' : 'normal'}}
            buttonStyle={{backgroundColor: "#FFF" }}
          />
          
        </Tab>

        <TabView value={tabIndex} onChange={setTabIndex} animationType="spring">
          <TabView.Item style={[styles.tabViewItem, { display: tabIndex === 0 ? 'flex' : 'none' }]}>
            <View style={{width: "90%", padding:30}}>
            {orderDetails ? (
              <View>
              <Text
              style={styles.title}>Informasi Pemesanan</Text>
              <Text style={styles.desc}>Lokasi Jemput</Text>
              <Text style={styles.desc2}>{orderDetails.address}</Text>
              <Text style={styles.desc}>Sopir Ambulans</Text>
              <Text style={styles.desc2}>{orderDetails.sopir}</Text>
              <Text style={styles.desc}>Status</Text>
              <Text style={styles.desc2}>{orderDetails.status}</Text>
              <Text style={styles.desc}>Waktu Pemesanan</Text>
              <Text style={styles.desc2}>{orderDetails.waktu}</Text>

              <View style={{padding:25}}>
                <Button
                onPress={handleNavigationAndToggle}
                title={"Lacak"}
                buttonStyle={{
                  backgroundColor: "#FF6F6F",
                  width: 100,
                  borderRadius: 20,
                  alignSelf: "center",
                  padding:10}}>

                </Button>
              </View>
              </View>
              ) : (
                <Text style={styles.title}>Anda belum memesan ambulans</Text>
              )}
            </View>
            
          </TabView.Item>
          <TabView.Item style={[styles.tabViewItem, { display: tabIndex === 1 ? 'flex' : 'none' }]}>
            <View style={{width: "90%"}}>
            <Text style={styles.title}>Kode Pemesanan</Text>
              <TextInput style={{
                width: "90%",
                borderColor: "grey",
                borderWidth: 1,
                borderRadius:10,
                alignSelf: "center"}}
                onChangeText={text => setOrderCode(text)}>
                
              </TextInput>

              <View style={{padding:35}}>
                <Button
                title={"Lacak"}
                onPress={checkOrderCode}
                buttonStyle={{
                  backgroundColor: "#FF6F6F",
                  width: 100,
                  borderRadius: 20,
                  alignSelf: "center",
                  padding:10}}>
                  
                </Button>
              </View>
            </View>
          </TabView.Item>
          
        </TabView>
    
        
      </Overlay>
    </View>
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
    backgroundColor: '#FF6F6F',
    borderRadius: 20
    
  },

  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"

  },

  logo: {
    width: "80%",
    alignItems: 'center',
    justifyContent: "center",
    height:70,
    
    
  },

  imageContainer: {
    width:"95%",
    height: 180, // Menetapkan tinggi gambar
    alignItems: 'center',
    justifyContent: "center",
    borderRadius:20,
    
  },

  image: {
    width:360, // Menyesuaikan lebar gambar dengan lebar View
    height: 180, // Menetapkan tinggi gambar
    objectFit: "cover", // Memastikan gambar mengisi ruang tanpa terdistorsi
    borderRadius: 20 // Menerapkan border radius
    
  },

  slide: {
    
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Warna latar belakang semi-transparan
    paddingVertical: 15,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Warna dot
  },
  activeDot: {
    backgroundColor: '#5ed7ff', // Warna dot aktif
  },

  buttonsection: {
    paddingTop: 70,
    width: "100%"
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", 
    paddingTop: 10,
    width: "100%"
  },

  buttonTextContainer: {
    
    flexDirection: "column"
  },

  button: {
    width: 70,
    height: 70,
    backgroundColor: "#FF6F6F",
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

  TrackOverlay: {
    width: "95%",
  },

  tabViewItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    padding: 20
  },

  desc: {
    paddingVertical:3,
    fontSize:18,
    color: "black"
  },
  desc2: {
    paddingBottom:10,
    fontSize:16,
  },
});

export default HomeUser;
