import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Button, ImageBackground } from 'react-native';

export default function Ambulance({ navigation }) {
  
  return (
      <ScrollView>
        <Header
          backgroundColor="#FF6F6F"
          leftComponent={
            <TouchableOpacity
            onPress={() => navigation.goBack()}>
              <IconOutline name="arrow-left" color="white" size={25}/>
            </TouchableOpacity>
          }
          centerComponent={{ text: 'Daftar Ambulans', style: { color: '#fff', fontSize: 22} }}
          
        />
        <View style={styles.container}>
          <TouchableOpacity style={styles.dataContainer}
          onPress={() => navigation.navigate('Detail')}>

            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View>
                  <Text style={styles.dataInside}>
                    Kondisi   :
                  </Text>
                </View>
                
              </View>
              <View style={styles.conditionContainer}>
                <TouchableOpacity style={styles.conditionButton}>
                  <Text style={{color: "white", fontSize: 16}}>
                    Tersedia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.data,{paddingTop: 55, paddingLeft:15, flexDirection: "column"}]}>
              <Image source={
                  require('./resource/img/ambulans.jpeg')}
              style={{width: 140, height: 100, borderRadius:15}}></Image>
              <Text style={{textAlign: "center", padding:10}}>4,2km</Text>
            </View>
          </TouchableOpacity>



          <View style={styles.dataContainer}>

            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View>
                  <Text style={styles.dataInside}>
                    Kondisi   :
                  </Text>
                </View>
                
              </View>
              <View style={styles.conditionContainer}>
                <TouchableOpacity style={styles.conditionButton}>
                  <Text style={{color: "white", fontSize: 16}}>
                    Tersedia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.data,{paddingTop: 55, paddingLeft:15, flexDirection: "column"}]}>
              <Image source={
                  require('./resource/img/ambulans.jpeg')}
              style={{width: 140, height: 100, borderRadius:15}}></Image>
              <Text style={{textAlign: "center", padding:10}}>4,2km</Text>
            </View>
          </View>




          <View style={styles.dataContainer}>

            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View>
                  <Text style={styles.dataInside}>
                    Kondisi   :
                  </Text>
                </View>
                
              </View>
              <View style={styles.conditionContainer}>
                <TouchableOpacity style={[styles.conditionButton, {backgroundColor: "#E64848"}]}>
                  <Text style={{color: "white", fontSize: 16}}>
                    Tidak Tersedia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.data,{paddingTop: 55, paddingLeft:15, flexDirection: "column"}]}>
              <Image source={
                  require('./resource/img/ambulans.jpeg')}
              style={{width: 140, height: 100, borderRadius:15}}></Image>
              <Text style={{textAlign: "center", padding:10}}>4,2km</Text>
            </View>
          </View>




          <View style={styles.dataContainer}>

            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View>
                  <Text style={styles.dataInside}>
                    Kondisi   :
                  </Text>
                </View>
                
              </View>
              <View style={styles.conditionContainer}>
                <TouchableOpacity style={styles.conditionButton}>
                  <Text style={{color: "white", fontSize: 16}}>
                    Tersedia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.data,{paddingTop: 55, paddingLeft:15, flexDirection: "column"}]}>
              <Image source={
                  require('./resource/img/ambulans.jpeg')}
              style={{width: 140, height: 100, borderRadius:15}}></Image>
              <Text style={{textAlign: "center", padding:10}}>4,2km</Text>
            </View>
          </View>




          <View style={styles.dataContainer}>

            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View>
                  <Text style={styles.dataInside}>
                    Kondisi   :
                  </Text>
                </View>
                
              </View>
              <View style={styles.conditionContainer}>
                <TouchableOpacity style={styles.conditionButton}>
                  <Text style={{color: "white", fontSize: 16}}>
                    Tersedia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.data,{paddingTop: 55, paddingLeft:15, flexDirection: "column"}]}>
              <Image source={
                  require('./resource/img/ambulans.jpeg')}
              style={{width: 140, height: 100, borderRadius:15}}></Image>
              <Text style={{textAlign: "center", padding:10}}>4,2km</Text>
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
    borderBottomWidth: 1,
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
    color: "#000",
    paddingBottom:20,
    fontWeight: "bold"
  },

  dataInside: {
    fontSize: 16,
    width: "50%",
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
  
});


