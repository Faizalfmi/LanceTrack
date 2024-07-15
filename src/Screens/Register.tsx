import axios from 'axios';
import { Component } from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nik, setNik] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://10.0.2.2/ambulance/register.php', {
        name,
        email,
        phone,
        password,
        nik
      });
      
      if (response.data.success) {
        Alert.alert('Registrasi Berhasil', response.data.message);
        navigation.navigate('LoginUser');
      } else {
        Alert.alert('Registrasi Gagal', response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <Text style={styles.inputText}>Nama Lengkap (Sesuai KTP)</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setName(text)}
      />

      <Text style={styles.inputText}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setEmail(text)}
      />

      <Text style={styles.inputText}>No HP</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setPhone(text)}
        keyboardType="phone-pad"
      />

      <Text style={styles.inputText}>NIK</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setPhone(text)}
        maxLength={16}
        
      />

      <Text style={styles.inputText}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        
      />


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{flexDirection: "row"}}>
        <Text style={{color: "black", fontSize: 16}}>Sudah punya akun? </Text><TouchableOpacity onPress={() => navigation.navigate('LoginUser')}><Text style={{color: "#FF6F6F", fontSize: 14, fontWeight: "bold"}}>Login</Text></TouchableOpacity>
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

export default RegisterScreen;
