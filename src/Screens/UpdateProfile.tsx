import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function History({ navigation, route }) {

    const { userData } = route.params;

  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email || '');
  const [hp, setHP] = useState(userData.hp || '');
  const [NIK, setNik] = useState(userData.NIK || '');

  const handleUpdate = async () => {
    try {
      const updatedData = {
        id: userData.id,
        name,
        email,
        hp,
        NIK
      };

      const response = await axios.post('https://91a7-125-164-23-22.ngrok-free.app/api/updateProfile.php', updatedData);

      if (response.data.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
        Alert.alert('Update Berhasil', 'Profil Anda telah diperbarui.');
        navigation.navigate('Profile', { userData: updatedData });
      } else {
        Alert.alert('Update Gagal', response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
    }};
  
  return (
      <ScrollView style={{backgroundColor: "white"}}>
        <Header
          backgroundColor="#14A44D"
          leftComponent={
            <TouchableOpacity
            onPress={() => navigation.goBack()}>
              <IconOutline name="arrow-left" color="white" size={25}/>
            </TouchableOpacity>
          }
          centerComponent={{ text: 'Update Profile', style: { color: '#fff', fontSize: 22} }}
          
        />
        <View style={styles.container}>
            <View style={styles.dataContainer}>
                <View style={styles.data}>
                    <IconOutline name="user" color="#B9B9B9" size={25}></IconOutline>
                    <View style={styles.dataText}>
                    <Text style={styles.dataTitle}>
                        Nama Lengkap
                    </Text>
                    <TextInput
                        style={styles.dataInside}
                        value={name}
                        onChangeText={setName}
                        />
                    </View>
                </View>
                <View style={styles.data}>
                    <IconOutline name="mail" color="#B9B9B9" size={25}></IconOutline>
                    <View style={styles.dataText}>
                    <Text style={styles.dataTitle}>
                        Email
                    </Text>
                    <TextInput
                        style={styles.dataInside}
                        value={email}
                        onChangeText={setEmail}
                        />
                    </View>
                </View>
                <View style={styles.data}>
                    <IconOutline name="phone" color="#B9B9B9" size={25}></IconOutline>
                    <View style={styles.dataText}>
                    <Text style={styles.dataTitle}>
                        Phone
                    </Text>
                    <TextInput
                        style={styles.dataInside}
                        value={hp}
                        onChangeText={setHP}
                        />
                    </View>
                </View>
                <View style={styles.data}>
                    <IconOutline name="idcard" color="#B9B9B9" size={25}></IconOutline>
                    <View style={styles.dataText}>
                    <Text style={styles.dataTitle}>
                        NIK
                    </Text>
                    <TextInput
                        style={styles.dataInside}
                        value={NIK}
                        onChangeText={setNik}
                        />            
                    </View>
                </View>
            </View>
            <View style={{paddingTop:80, width:"100%"}}>
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>
            
        </View>
      </ScrollView>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin:10,
    backgroundColor: 'white'
  },


  dataContainer: {
    width: "100%",
    padding: 20,
    paddingTop: 50,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    bottom: 0
  },

  data: {
    padding:10,
    paddingTop: 30,
    flexDirection: "row",
    width: "100%",
    
  },

  dataText: {
    paddingLeft:20,
    width: '80%'
  },

  dataTitle: {
    fontSize: 16,
    paddingBottom:10,
    
  },

  dataInside: {
    fontSize: 16,
    paddingBottom:25,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    width: '100%'
  },

  button: {
    width: "90%",
    height: 48,
    borderRadius: 50,
    backgroundColor: "#14A44D",
    alignSelf: "center",
    justifyContent: "center",
    
    
  },

  buttonText: {
    color: "white",
    fontSize: 22,
    textAlign: "center"
  }
  
});