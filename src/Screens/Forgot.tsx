import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Header, Button } from '@rneui/base';
import { IconOutline } from '@ant-design/icons-react-native';
import DatePicker from 'react-native-date-picker';

export default function ForgotPassword({ navigation }) {
  const [nik, setNik] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState('Masukkan Tanggal Lahir Anda');

  const formatDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Bulan dimulai dari 0
    let year = date.getFullYear();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return `${day}/${month}/${year}`;
  };

  const handleConfirm = (date) => {
    setOpen(false);
    setDate(date);
    setSelectedDateLabel(formatDate(date));
  };

  const handleForgotPassword = async () => {
    const formattedDate = formatDate(date);
    try {
      const response = await axios.post('https://91a7-125-164-23-22.ngrok-free.app/api/forgot_password.php', { 
        nik,
        birthDate: formattedDate
      });
      if (response.data.success) {
        Alert.alert('Success', 'Verifikasi NIK dan tanggal lahir sukses');
        navigation.navigate('ResetPassword', { nik });
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
        backgroundColor="#14A44D"
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
          placeholder="Masukkan NIK Anda"
          value={nik}
          onChangeText={setNik}
          keyboardType='numeric'
        />
        <View style={{
          padding: 10,
          paddingBottom: 40,
        }}>
          <Button buttonStyle={styles.button} titleStyle={styles.buttonText2} title={selectedDateLabel} onPress={() => setOpen(true)} />
          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={handleConfirm}
            mode='date'
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
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
