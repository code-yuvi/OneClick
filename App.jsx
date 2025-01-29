import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens and Components
import HomeScreen from './Screen/HomeScreen';
import Home from './Screen/Photographer/Home';
import HomeUser from './Screen/User/HomeUser';
import LoginUser from './Screen/User/LoginUser';
import SignupUser from './Screen/User/SignupUser';
import PhotoLogin from './Screen/Photographer/PhotoLogin';
import SignupPhoto from './Screen/Photographer/SignupPhoto';
import UpdateProfile from './Screen/User/UpdateProfile/UpdateProfile';
import PhotoUI from './Screen/Photographer/PhotoUI';
import UpdateProfilePhoto from './Screen/Photographer/UpdateProfile/UpdateProfilePhoto';
import DrawerContent from './DrawerContent';
import DrawerContentPhoto from './DrawerContentPhoto';
import PhotoHome from './Screen/Photographer/PhotoHome';
import Profile from './Screen/Photographer/Profile';
import UserUI from './Screen/User/UserUI';
import HomeU from './Screen/User/HomeU';
import MyBooking from './Screen/User/MyBooking';
import MyBookings from './Screen/Photographer/MyBookings';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNav = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='HomeScreen'>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="HomeUser" component={HomeUser} />
    <Stack.Screen name='LoginUser' component={LoginUser} />
    <Stack.Screen name='SignupUser' component={SignupUser} />
    <Stack.Screen name='PhotoLogin' component={PhotoLogin} />
    <Stack.Screen name='SignupPhoto' component={SignupPhoto} />
    <Stack.Screen name='Homep' component={PhotoHome} />
    <Stack.Screen name='Profile' component={Profile} />
    <Stack.Screen name='DrawerNav' component={DrawerNavWrapper} />
  </Stack.Navigator>
);

const DrawerNavWrapper = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const storedUserType = await AsyncStorage.getItem('userType');
      setUserType(storedUserType);
    };

    fetchUserType();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={props =>
        userType === 'user' ? <DrawerContent {...props} /> : <DrawerContentPhoto {...props} />
      }
      screenOptions={{ headerShown: false }}
    >
      {userType === 'user' ? (
        <>
          <Drawer.Screen name='UserUI' component={UserUI} />
          <Drawer.Screen name='UpdateProfile' component={UpdateProfile} />
          <Drawer.Screen name='HomeU' component={HomeU} />
          <Drawer.Screen name='MyBooking' component={MyBooking} />

        </>
      ) : (
        <>
          <Drawer.Screen name='PhotoUI' component={PhotoUI} />
          <Drawer.Screen name='UpdateProfilePhoto' component={UpdateProfilePhoto} />
          <Drawer.Screen name='PhotoHome' component={PhotoHome} />
          <Drawer.Screen name='MyBookings' component={MyBookings} />
        </>
      )}
      <Drawer.Screen name='SignOut' component={StackNav} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(data === 'true');
    };

    getData();
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <DrawerNavWrapper /> : <StackNav />}
    </NavigationContainer>
  );
};

export default App;