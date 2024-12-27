import axios from 'axios';
import { Component } from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://your-server.com/login.php', {
        email,
        password
      });
      
      if (response.data.success) {
        Alert.alert('Login Berhasil', `Selamat datang, ${response.data.user.name}`);
        navigation.navigate('Home', { user: response.data.user });
      } else {
        Alert.alert('Login Gagal', response.data.message);
      }
    } catch (error) {
      console.error(error);
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

      <View style={{flexDirection: "column", width: "100%", alignItems: "center",}}>
        <Text style={{color: "black", fontSize: 16}}>Masuk ke halaman pemesan? </Text><TouchableOpacity><Text style={{color: "#FF6F6F", fontSize: 16, fontWeight: "bold"}}>Masuk sebagai pemesan</Text></TouchableOpacity>
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
    color: '#C21010',
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
    backgroundColor: '#FF6F6F', 
    borderRadius: 25,
    
  },
  buttonText: {
    color: 'white', 
    fontSize: 22,
  },
});

export default LoginScreen;
