
import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import HomeScreen from './Screen/HomeScreen'
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screen/Photographer/Home';
import HomeUser from './Screen/User/HomeUser';
import LoginUser from './Screen/User/LoginUser';
import SignupUser from './Screen/User/SignupUser';
import PhotoLogin from './Screen/Photographer/PhotoLogin';
import SignupPhoto from './Screen/Photographer/SignupPhoto';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateProfile from './Screen/User/UpdateProfile/UpdateProfile';
import PhotoUI from './Screen/Photographer/PhotoUI';
import UpdateProfilePhoto from './Screen/Photographer/UpdateProfile/UpdateProfilePhoto';
import DrawerContentPhoto from './DrawerContentPhoto';
import PhotoHome from './Screen/Photographer/PhotoHome';
import Profile from './Screen/Photographer/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserUI from './Screen/User/UserUI';
import HomeU from './Screen/User/HomeU';



const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='HomeScreen' >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="HomeUser" component={HomeUser} />
      <Stack.Screen name='LoginUser' component={LoginUser} />
      <Stack.Screen name='SignupUser' component={SignupUser} />
      <Stack.Screen name='PhotoLogin' component={PhotoLogin} />
      <Stack.Screen name='SignupPhoto' component={SignupPhoto} />
      <Stack.Screen name='Homep' component={PhotoHome} />
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='DrawerNav' component={DrawerNav} />
      {/* <Stack.Screen name='UserUI' component={UserUI} /> */}

    </Stack.Navigator>
  )
}


const DrawerNav = ({ userType }) => {
  const Drawer = createDrawerNavigator();
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
        </>
      ) : (
        <>
          <Drawer.Screen name='PhotoUI' component={PhotoUI} />
          <Drawer.Screen name='UpdateProfilePhoto' component={UpdateProfilePhoto} />
          <Drawer.Screen name='PhotoHome' component={PhotoHome} />
          <Drawer.Screen name='Profile' component={Profile} />
        </>
      )}
      <Drawer.Screen name='SignOut' component={StackNav} />
    </Drawer.Navigator>
  );
};



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    const usertype = await AsyncStorage.getItem('userType');

    console.log('AsyncStorage values:', { data, usertype });
    console.log(usertype, 'at app.jsx');
    console.log(data, 'at app.jsx');
    setIsLoggedIn(data=='true'); 
    setUserType(usertype);
  } 

  useEffect(() => {
    getData();
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }, [])


  return (
    <>

      <NavigationContainer>
        {/* {isLoggedIn ? <DrawerNav userType={userType} /> : <StackNav />} */}
        {isLoggedIn && userType ? (
          <DrawerNav userType={userType} />  // Show the drawer navigation based on userType
        ) : (
          <StackNav />  // Show login/signup if not logged in
        )}
      </NavigationContainer>

    </>
  );
}


export default App;
