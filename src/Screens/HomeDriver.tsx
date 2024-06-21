import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Overlay, Tab, TabView } from '@rneui/themed';
import { Component, useCallback, useEffect } from 'react';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native';
import Swiper from 'react-native-swiper';

type OverlayComponentProps = {};

const HomeUser: React.FunctionComponent<OverlayComponentProps> = ({navigation, route}) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUserName = await AsyncStorage.getItem('userName');
      const storedUserData = await AsyncStorage.getItem('userData');

      console.log('Stored User Data:', storedUserData);

      if (userToken && storedUserName) {
        setIsLoggedIn(true);
        setUserName(storedUserName);
        setUserData(JSON.parse(storedUserData));
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      Alert.alert('Logout Berhasil', 'Anda telah keluar.');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
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

      
      
        {/* Swiper gambar ambulans */}
        <View style={styles.orderContainer}>
            <Text style={styles.title}>
                Pesanan Aktif
            </Text>
            <View style={styles.orderShadow}>
                <View style={styles.order}>
                    <View style={{flexDirection: "row", width: "100%", padding:8, paddingTop:15}}>
                        <View style={{width: "50%"}}>
                            <Text style={styles.desc}>
                                Kode pemesanan
                            </Text>
                            <Text style={styles.desc}>
                                Nama pemesan
                            </Text>
                            <Text style={styles.desc}>
                                Lokasi
                            </Text>
                            <Text style={styles.desc}>
                                Jarak
                            </Text>
                        </View>
                        <View style={{width: "50%"}}>
                            <Text style={styles.desc}>
                                :
                            </Text>
                            <Text style={styles.desc}>
                                :
                            </Text>
                            <Text style={styles.desc}>
                                :
                            </Text>
                            <Text style={styles.desc}>
                                :
                            </Text>
                        </View>
                        
                    </View>

                    <View style={{padding:10}}>
                        <TouchableOpacity style={[styles.tombol, {backgroundColor: "#FF6F6F"}]}>
                            <Text style={styles.textTombol}>Lihat Lokasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
      
        {/* Container tombol menu */}
        <View style={styles.buttonsection}>

            {/* Baris 2 tombol menu */}
            <View style={styles.buttonsContainer}>

                <TouchableOpacity style={styles.buttonTextContainer}
                onPress={() => navigation.navigate('History')}>
                <View style={styles.button}>
                <Image source={
                        require('./resource/img/riwayat.png')}
                        style={styles.buttonIcon}></Image>
                </View>
                <Text style={styles.buttonText}>
                    History
                </Text>
                </TouchableOpacity>
            
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
            
            </View>

        </View>

        <View style={{paddingTop:150}}>
            <TouchableOpacity style={[styles.tombol, {backgroundColor: "#E64848"}]} onPress={handleLogout}>
                <Text style={styles.textTombol}>Logout</Text>
            </TouchableOpacity>
        </View>
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
});

export default HomeUser;
