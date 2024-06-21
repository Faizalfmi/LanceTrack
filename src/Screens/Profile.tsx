import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Button, ImageBackground, Alert } from 'react-native';


export default function Profile({ navigation, route }) {

  const { userData } = route.params;
  
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
        <View style={styles.card}>
          <ImageBackground source={require('./resource/img/profile_background.jpg')} style={styles.card} imageStyle={{borderRadius:20}}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonBackground} 
              onPress={() => navigation.goBack()}>
                <IconOutline name='arrow-left' size={30} color="white"/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonBackground} 
              onPress={() => navigation.navigate('UpdateProfile', { userData })}>
                <IconFill name="edit" size={30} color="white"></IconFill>
              </TouchableOpacity>
            </View>

            <View style={styles.profile}>
              <Image source={require('./resource/img/profile.png')} style={{width:80, height:80}}></Image>
              <Text style={styles.name}>{userData ? userData.name : '-'}</Text>
            </View>
            
          </ImageBackground>
        </View>
        
        <View style={styles.dataContainer}>
          <View style={styles.data}>
            <IconFill name="mail" color="#B9B9B9" size={25}></IconFill>
            <View style={styles.dataText}>
              <Text style={styles.dataTitle}>
                Email
              </Text>
              <Text style={styles.dataInside}>
                {userData ? userData.email : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.data}>
            <IconFill name="phone" color="#B9B9B9" size={25}></IconFill>
            <View style={styles.dataText}>
              <Text style={styles.dataTitle}>
                Phone
              </Text>
              <Text style={styles.dataInside}>
                {userData ? userData.hp : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.data}>
            <IconFill name="idcard" color="#B9B9B9" size={25}></IconFill>
            <View style={styles.dataText}>
              <Text style={styles.dataTitle}>
                NIK
              </Text>
                <Text style={styles.dataInside}>
                {userData ? userData.NIK : '-'}
              </Text>             
            </View>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={{flexDirection: "row"}}>
              <Text style={{color: "white", fontSize: 16, paddingHorizontal: 7}}>
                Logout  
              </Text>
              <IconOutline name="logout" color="white" size={23}></IconOutline>
            </View>
          </TouchableOpacity>
        </View>

        
      </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    margin:10,
    backgroundColor: 'white'
  },

  card: {
    width:370,
    height:230,
    
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width:'100%',
    paddingHorizontal:20,
    paddingTop:17
  },

  buttonBackground: {
    
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },

  profile: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },

  dataContainer: {
    width: "100%",
    padding: 20,
    paddingTop: 50,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },

  data: {
    padding:10,
    paddingTop: 30,
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#BABCCA",
  },

  dataText: {
    paddingLeft:20
  },

  dataTitle: {
    fontSize: 16,
    paddingBottom:10
  },

  dataInside: {
    fontSize: 16,
    paddingBottom:25,
    color: "#000"
  },

  logoutContainer: {
    justifyContent: "flex-end",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop:100
  },

  logoutButton: {
    backgroundColor: "#E64848",
    width: 140,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  
});


