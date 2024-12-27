import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { Header } from "@rneui/base";
import axios from "axios";
import { Rating, AirbnbRating } from 'react-native-ratings';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Button, ImageBackground, Alert } from 'react-native';

export default function Review({ navigation, route }) {

  const {id, riwayat} = route.params;
  const { kode, id_ambulans, id_sopir } = riwayat;
    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(0);
    const [review1, setReview1] = useState('');
    const [review2, setReview2] = useState('');

    const ratingCompleted1 = (rating: number) => {
    console.log('Rating is: ' + rating);
    setRating1(rating);
    };

    const ratingCompleted2 = (rating: number) => {
    console.log('Rating is: ' + rating);
    setRating2(rating);
    };

    const handleReview = async () => {
      try {
        // Debugging untuk memastikan data yang dikirim tidak null
        console.log('Data yang dikirim:', { kode, id, id_ambulans, id_sopir, rating1, rating2, review1, review2 });
  
        // Memastikan data tidak null sebelum mengirimkan permintaan
        if (id) {
          const response = await axios.post('https://91a7-125-164-23-22.ngrok-free.app/api/post_review.php', {
            kode, 
            id, 
            id_ambulans, 
            id_sopir, 
            rating1, 
            rating2, 
            review1, 
            review2
          });
  
          if (response.data.success) {
            Alert.alert('Ulasan berhasil ditambahkan', response.data.message);
            navigation.navigate('History', {id});
          } else {
            Alert.alert('Pemberian ulasan gagal', response.data.message);
          }
        } else {
          Alert.alert('Error', 'Data incomplete. Please try again.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
      }
    };
  
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
          centerComponent={{ text: 'Ulasan', style: { color: '#fff', fontSize: 22} }}
          
        />
        <View style={styles.container}>
            <View style={styles.dataContainer}>
                <View style={styles.data}>
                    <View style={styles.dataText}>
                        <Text style={styles.dataTitle}>
                        {riwayat.ambulans}
                        </Text>
                        <View style={styles.desc}>
                            <Text style={styles.dataInside}>
                                Sopir
                            </Text>
                            <Text style={styles.dataInside3}>
                                : 
                            </Text>
                            <Text style={styles.dataInside2}>
                                {riwayat.sopir}
                            </Text>
                        </View>
                        {/* <View style={styles.desc}>
                            <Text style={styles.dataInside}>
                                Lokasi jemput
                            </Text>
                            <Text style={styles.dataInside3}>
                                : 
                            </Text>
                            <Text style={styles.dataInside2}>
                                {riwayat.address}
                            </Text>
                        </View> */}
                        <View style={styles.desc}>
                            <Text style={styles.dataInside}>
                                Tanggal
                            </Text>
                            <Text style={styles.dataInside3}>
                                : 
                            </Text>
                            <Text style={styles.dataInside2}>
                                {riwayat.waktu}
                            </Text>
                        </View>
                        <View style={styles.desc}>
                            <Text style={styles.dataInside}>
                                Status
                            </Text>
                            <Text style={styles.dataInside3}>
                                : 
                            </Text>
                            <Text style={styles.dataInside2}>
                                {riwayat.status}
                            </Text>
                        </View>
                        
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} 
                    placeholder="Tulis ulasan untuk sopir..." multiline
                    onChangeText={text => setReview1(text)}/>
                </View>

                <View style={styles.rating}>
                    <Rating
                        type='star'
                        ratingCount={5}
                        fractions={1}
                        imageSize={40}
                        showRating
                        startingValue={0}
                        onFinishRating={ratingCompleted1}
                        style={{ paddingVertical: 10 }}
                        
                    />
                    
                </View>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} 
                    placeholder="Tulis ulasan untuk kendaraan ambulans..." multiline
                    onChangeText={text => setReview2(text)}
                    />
                </View>

                <View style={styles.rating}>
                    <Rating
                        type='star'
                        startingValue={0}
                        fractions={1}
                        ratingCount={5}
                        imageSize={40}
                        showRating
                        onFinishRating={ratingCompleted2}
                        style={{ paddingVertical: 10 }}
                        
                    />
                    
                </View>

                <View style={styles.reviewContainer}>
                    <TouchableOpacity style={styles.reviewButton} 
                    onPress={handleReview}>
                        <Text style={{color: "white", fontSize: 20}}>
                        Selesai
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
    
  },

  data: {
    padding:10,
    paddingTop: 10,
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
    fontSize: 28,
    color: "#000",
    paddingBottom:35,
    textAlign: "center"
  },

  dataInside: {
    fontSize: 16,
    width: "40%",
    color: "#555555"
  },
  dataInside2: {
    fontSize: 16,
    width: "57%",
    color: "#555555"
  },
  dataInside3: {
    fontSize: 16,
    width: "3%",
    color: "#555555"
  },

  inputContainer:{
    width: "100%",
    paddingTop: 40
  },

  input:{
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius:20,
    height: 130,
    fontSize:16,
    textAlignVertical: "top",
    padding: 15
  },

  rating: {
    paddingTop: 20,
    width: '100%',
    alignContent: "center",
  },

  reviewContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 40
  },

  reviewButton: {
    backgroundColor: "#14A44D",
    width: 280,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    
  },
  
});


