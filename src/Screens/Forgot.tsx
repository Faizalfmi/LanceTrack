import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Header } from '@rneui/base';
import { IconOutline } from '@ant-design/icons-react-native';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://10.0.2.2/ambulance/forgot_password.php', { email });
      if (response.data.success) {
        Alert.alert('Success', 'Please check your email for the reset link.');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        backgroundColor="#FF6F6F"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: '', style: { color: '#fff', fontSize: 22 } }}
      />
      <View style={styles.container2}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email anda"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.customButton} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    padding: 50,
    backgroundColor: "white"
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    padding: 20,
    color: "#C21010"
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  customButton: {
    width: 300,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6F6F',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
