import { IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';

export default function Review_list({ navigation, route }) {
  const { review } = route.params;

  return (
    <ScrollView>
      <Header
        backgroundColor="#14A44D"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconOutline name="arrow-left" color="white" size={25} />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Ulasan', style: { color: '#fff', fontSize: 22 } }}
      />
      <View style={styles.container}>
        {Array.isArray(review) && review.length > 0 ? (
          review.map((riwayat, index) => (
            <View style={styles.dataContainer} key={index}>
              <View style={styles.data}>
                <View style={styles.dataText}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.dataTitle}>{riwayat.nama_pemesan}</Text>
                        <View style={{flexDirection: "row", justifyContent: "flex-end", height: 50, alignItems: "center"}}>
                            <Rating
                                type='star'
                                ratingCount={5}
                                fractions={1}
                                imageSize={20}
                                startingValue={riwayat.rating_ambulans}
                                readonly
                                style={{ paddingVertical: 10 }}
                                
                                showReadOnlyText={false}
                                
                            />
                            <Text style={{padding: 5}}>
                                ({riwayat.rating_ambulans})
                            </Text>
                        </View>
                    </View>
                  
                  
                  <View style={{ paddingBottom: 10 }}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>Sopir ambulans</Text>
                      </View>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>: </Text>
                        <Text style={styles.desc}>{riwayat.nama_sopir}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>Waktu ulasan</Text>
                      </View>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>: </Text>
                        <Text style={styles.desc}>{riwayat.waktu}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>Ulasan</Text>
                      </View>
                      <View style={styles.descCol}>
                        <Text style={styles.desc}>: </Text>
                        <Text style={styles.desc}>{riwayat.review_ambulans}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.reviewContainer}>
                
              </View>
            </View>
          ))
        ) : (
          <Text>Tidak ada ulasan yang ditemukan.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
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
    padding: 10,
    paddingTop: 10,
    flexDirection: "row",
    width: "100%",
  },
  dataText: {
    width: "100%"
  },
  dataTitle: {
    fontSize: 22,
    color: "#000",
    paddingBottom: 10,
    
  },
  descCol: {
    flexDirection: "row",
    width: "50%",
    padding: 3
  },
  desc: {
    fontSize: 16
  },
  reviewContainer: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
  },
  reviewButton: {
    backgroundColor: "#14A44D",
    width: 110,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  }
});
