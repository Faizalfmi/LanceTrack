import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Button, ImageBackground } from 'react-native';

export default function History({ navigation }) {
  
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
          centerComponent={{ text: 'Riwayat', style: { color: '#fff', fontSize: 22} }}
          
        />
        <View style={styles.container}>
          <View style={styles.dataContainer}>
            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Sopir
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Tujuan
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Lokasi jemput
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Tanggal
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Jarak
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.reviewContainer}>
              <TouchableOpacity style={styles.reviewButton}>
                <Text style={{color: "white", fontSize: 16}}>
                  Ulas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.data}>
              <View style={styles.dataText}>
                <Text style={styles.dataTitle}>
                  Nama Ambulans
                </Text>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Sopir
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Tujuan
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Lokasi jemput
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Tanggal
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.dataInside}>
                    Jarak
                  </Text>
                  <Text style={styles.dataInside}>
                    :
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.reviewContainer}>
              <TouchableOpacity style={styles.reviewButton}>
                <Text style={{color: "white", fontSize: 16}}>
                  Ulas
                </Text>
              </TouchableOpacity>
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
    padding: 20,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#BABCCA",
  },

  data: {
    padding:10,
    paddingTop: 30,
    flexDirection: "row",
    width: "100%",
    
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
    fontSize: 22,
    color: "#000",
    paddingBottom:10
  },

  dataInside: {
    fontSize: 16,
    width: "50%",
    color: "#555555"
  },

  reviewContainer: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    
  },

  reviewButton: {
    backgroundColor: "#FF6F6F",
    width: 110,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  
});


