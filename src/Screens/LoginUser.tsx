import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Component } from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://91a7-125-164-23-22.ngrok-free.app/api/login.php', {
        email,
        password
      });
      
      console.log('Response:', response.data);

      if (response.data.success) {
        const userToken = response.data.token; // Pastikan token diterima dari backend
        const userName = response.data.user.name; // Pastikan nama diterima dari backend
        const userId = response.data.user.id; // Pastikan nama diterima dari backend
        const userRole = response.data.user.role;
        const userData = response.data.user; 
        
        if (userToken && userName && userData) {
          // Simpan token dan nama pengguna ke AsyncStorage
          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('userId', userId);
          await AsyncStorage.setItem('userRole', userRole); // Simpan peran pengguna
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          
          Alert.alert('Login Berhasil', `Selamat datang, ${userName}`);
          
          navigation.navigate('HomeUser', { user: userData, id:userId });
        } else {
          throw new Error('Data token atau nama pengguna tidak valid');
        }
      } else {
        Alert.alert('Login Gagal', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <Text style={styles.inputText}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setEmail(text)}
      />

      <Text style={styles.inputText}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{flexDirection: "row"}}>
        <Text style={{color: "black", fontSize: 16}}>Belum punya akun? </Text><TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{color: "#14A44D", fontSize: 16, fontWeight: "bold"}}>Daftar</Text></TouchableOpacity>
      </View>
      
      <View style={{flexDirection: "row", padding: 10}}>
        <Text style={{color: "black", fontSize: 16}}>Lupa password? </Text><TouchableOpacity onPress={() => navigation.navigate('Forgot')}><Text style={{color: "#14A44D", fontSize: 16, fontWeight: "bold"}}>Reset</Text></TouchableOpacity>
      </View>

      <View style={{flexDirection: "column", width: "100%", alignItems: "center", paddingTop: 20}}>
        <Text style={{color: "black", fontSize: 16}}>Masuk ke halaman sopir? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginDriver')}>
          <Text style={{color: "#14A44D", fontSize: 16, fontWeight: "bold"}}>
            Masuk sebagai sopir
            </Text>
        </TouchableOpacity>
      </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "white"
  },
  header: {
    fontSize: 40,
    marginBottom: 20,
    padding: 20,
    color: '#14A44D',
    width: "95%"
    
  },

  input: {
    width: '85%',
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },

  inputText: {
    width: '85%',
    color: "black",
    fontSize: 16
  },

  buttonContainer: {
    margin: 20,
    padding: 25
  },

  customButton: {
    width: 300, 
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14A44D', 
    borderRadius: 25,
    
  },
  buttonText: {
    color: 'white', 
    fontSize: 22,
  },
});

export default LoginScreen;
