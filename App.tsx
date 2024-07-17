// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeUser from './src/Screens/HomeUser';
import HomeDriver from './src/Screens/HomeDriver';
import Profile from './src/Screens/Profile';
import UpdateProfile from './src/Screens/UpdateProfile';
import LoginUser from './src/Screens/LoginUser';
import Forgot from './src/Screens/Forgot';
import LoginDriver from './src/Screens/LoginDriver';
import Register from './src/Screens/Register';
import History from './src/Screens/History';
import Review from './src/Screens/Review';
import Review_list from './src/Screens/Review_list';
import Track from './src/Screens/Track';
import TrackDriver from './src/Screens/TrackDriver';
import Order from './src/Screens/Order';
import Ambulance from './src/Screens/Ambulance';
import DetailAmbulance from './src/Screens/DetailAmbulance';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeUser} options={{ headerShown: false }} />
        <Stack.Screen name="HomeDriver" component={HomeDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{ headerShown: false }} />
        <Stack.Screen name="LoginUser" component={LoginUser} options={{ headerShown: false }} />
        <Stack.Screen name="Forgot" component={Forgot} options={{ headerShown: false }} />
        <Stack.Screen name="LoginDriver" component={LoginDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
        <Stack.Screen name="Review" component={Review} options={{ headerShown: false }} />
        <Stack.Screen name="Review_list" component={Review_list} options={{ headerShown: false }} />
        <Stack.Screen name="Track" component={Track} options={{ headerShown: false }} />
        <Stack.Screen name="TrackDriver" component={TrackDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Stack.Screen name="Ambulan" component={Ambulance} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailAmbulance} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
