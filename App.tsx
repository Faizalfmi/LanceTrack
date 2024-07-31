import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeUser from './src/Screens/HomeUser';
import HomeDriver from './src/Screens/HomeDriver';
import Profile from './src/Screens/Profile';
import ProfileDriver from './src/Screens/ProfileDriver';
import UpdateProfile from './src/Screens/UpdateProfile';
import LoginUser from './src/Screens/LoginUser';
import Forgot from './src/Screens/Forgot';
import ResetPassword from './src/Screens/ResetPassword';
import LoginDriver from './src/Screens/LoginDriver';
import Register from './src/Screens/Register';
import History from './src/Screens/History';
import HistoryDriver from './src/Screens/HistoryDriver';
import Notif from './src/Screens/Notif';
import NotifDriver from './src/Screens/NotifDriver';
import Review from './src/Screens/Review';
import Review_list from './src/Screens/Review_list';
import Track from './src/Screens/Track';
import TrackDriver from './src/Screens/TrackDriver';
import Order from './src/Screens/Order';
import Ambulance from './src/Screens/Ambulance';
import DetailAmbulance from './src/Screens/DetailAmbulance';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const determineInitialRoute = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userRole = await AsyncStorage.getItem('userRole');

      if (userToken && userRole) {
        setInitialRoute(userRole === 'driver' ? 'HomeDriver' : 'HomeUser');
      } else {
        setInitialRoute('HomeUser'); // Atau halaman login default
      }
    };

    determineInitialRoute();
  }, []);

  if (initialRoute === null) {
    // Tampilkan layar loading atau apapun sampai peran pengguna didapatkan
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="HomeUser" component={HomeUser} options={{ headerShown: false }} />
        <Stack.Screen name="HomeDriver" component={HomeDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileDriver" component={ProfileDriver} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{ headerShown: false }} />
        <Stack.Screen name="LoginUser" component={LoginUser} options={{ headerShown: false }} />
        <Stack.Screen name="Forgot" component={Forgot} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="LoginDriver" component={LoginDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
        <Stack.Screen name="HistoryDriver" component={HistoryDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Notif" component={Notif} options={{ headerShown: false }} />
        <Stack.Screen name="NotifDriver" component={NotifDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Review" component={Review} options={{ headerShown: false }} />
        <Stack.Screen name="Review_list" component={Review_list} options={{ headerShown: false }} />
        <Stack.Screen name="Track" component={Track} options={{ headerShown: false }} />
        <Stack.Screen name="TrackDriver" component={TrackDriver} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Stack.Screen name="Ambulance" component={Ambulance} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailAmbulance} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
