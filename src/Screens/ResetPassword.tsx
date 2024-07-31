import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Header, Button } from '@rneui/base';
import { IconOutline } from '@ant-design/icons-react-native';
import DatePicker from 'react-native-date-picker';

export default function ForgotPassword({ navigation, route }) {
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const {nik} = route.params;

  const handleForgotPassword = async () => {
    if (newPassword2 === newPassword) {
        try {
            const response = await axios.post('http://10.0.2.2/ambulance/reset_password.php', { 
              nik,
              newPassword
            });
            if (response.data.success) {
              Alert.alert('Success', 'Password berhasil diubah');
              navigation.navigate('LoginUser');
            } else {
              Alert.alert('Error', response.data.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again later.');
          }
      } else {
        Alert.alert('Error', "Password tidak cocok");
      }
    
  };

  return (
    <View style={styles.container}>
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: '', style: { color: '#fff', fontSize: 22 } }}
      />
      <View style={styles.container2}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password Baru Anda"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Masukkan Ulang Password Baru Anda"
          value={newPassword2}
          onChangeText={setNewPassword2}
          secureTextEntry
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
    color: "#14A44D"
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
    backgroundColor: '#14A44D',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  buttonText2: {
    color: 'grey',
    fontSize: 14,
    textAlign: "left",
    
    width: "100%",
    padding:2
  },
  button: {
    width: 310,
    backgroundColor: "white",
    color: "black",
    
    borderBottomWidth: 1,
    borderColor: 'grey',
    
  }
});
