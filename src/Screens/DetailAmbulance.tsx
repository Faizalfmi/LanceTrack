import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { Header, Rating, Button } from "@rneui/base";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput,  ImageBackground } from 'react-native';

export default function DetailAmbulance({ navigation, route }) {

  const {ambulance} = route.params;
  
  return (
      <ScrollView style={{backgroundColor: "white"}}>
        <Header
          backgroundColor="#FF6F6F"
          leftComponent={
            <TouchableOpacity
            onPress={() => navigation.goBack()}>
              <IconOutline name="arrow-left" color="white" size={25}/>
            </TouchableOpacity>
          }
          centerComponent={{ text: 'Nama Ambulans', style: { color: '#fff', fontSize: 22} }}
          
        />
        <View style={{width: "100%", }}>
            <Image source={{ uri: `http://10.0.2.2/ambulance/${ambulance.gambar}` }}
              style={{objectFit: "cover", width: '100%',
                height: undefined,
                aspectRatio: 5/3, }}></Image>
        </View>


        <View style={styles.container}>
          <View style={styles.dataContainer}>

            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  {ambulance.nama}
                </Text>
                <View style={{flexDirection: "row", width: "100%"}}>
                  <View style={{width: "40%"}}>
                    <Text style={styles.dataInside}>
                      Plat Nomor
                    </Text>
                    <Text style={styles.dataInside}>
                      Tipe 
                    </Text>
                    <Text style={styles.dataInside}>
                      Terakhir servis
                    </Text>
                    <Text style={styles.dataInside}>
                      Kondisi
                    </Text>
                    <Text style={styles.dataInside}>
                      Kondisi
                    </Text>
                  </View>
                  <View style={{width: "60%"}}>
                    <Text style={styles.dataInside}>
                      : {ambulance.plat}
                    </Text>
                    <Text style={styles.dataInside}>
                      : {ambulance.tipe}
                    </Text>
                    <Text style={styles.dataInside}>
                      :
                    </Text>
                    <Text style={styles.dataInside}>
                      :
                    </Text>
                    <Text style={styles.dataInside}>
                      :
                    </Text>
                  </View>
                </View>
                
              </View>
              <View style={styles.conditionContainer}>
                <Text style={[styles.dataInside,{paddingBottom: 10}]}>Status</Text>
                <TouchableOpacity style={[styles.conditionButton, { backgroundColor: ambulance.status === 'available' ? '#85DD00' : '#E64848' }]}>
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {ambulance.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
                  </Text>
                </TouchableOpacity>
              </View>
              

              <View style={{flexDirection: "row", width: "100%", justifyContent: "space-between", paddingTop: 40}}>
                <Text style={styles.dataInside}>
                  Rating
                </Text>
                <TouchableOpacity>
                  <Text style={styles.dataInside}>
                    Lihat Review{'->'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{justifyContent: "flex-start", paddingVertical: 10, flexDirection: "row"}}>
                <Text style={styles.dataInside}>4.5</Text>
                <IconFill name="star" color="#ffd250" size={25}/>
                <Text style={[styles.dataInside,{paddingHorizontal:10}]}>(50)</Text>
              </View>

              <View style={{paddingVertical: 35}}>
              <Button
                title="Pesan"
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                disabled={ambulance.status !== 'available'} // Nonaktifkan tombol jika status tidak tersedia
              />

              </View>
              
            </View>
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
    
    flexDirection: "row",
    borderBottomWidth: 0,
    borderBottomColor: "#BABCCA",
  },

  data: {
    padding:10,
    paddingTop: 30,
    
    
    
  },

  dataText: {
    paddingLeft:20,
    width: "100%"
  },

  desc: {
    flexDirection: "row",
    width: "100%",
    
  },

  dataTitle: {
    fontSize: 24,
    color: "#FF6F6F",
    paddingBottom:20,
    fontWeight: "bold"
  },

  dataInside: {
    fontSize: 18,
    
    color: "#555555"
  },

  conditionContainer: {
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 20,
    paddingTop: 30
  },

  conditionButton: {
    backgroundColor: "#85DD00",
    width: "auto",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: 15
  },

  button: {
    width: "90%",
    height: 48,
    borderRadius: 50,
    backgroundColor: "#FF6F6F",
    alignSelf: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 22,
    textAlign: "center"
  }
  
});


