import { View, Text } from 'react-native'
import React from 'react'
import Background from './../../Component/Background'
import Btn from './../../Component/Btn'
import { darkGreen, white } from './../../assets/Color/Colors'
// import { LinearTextGradient } from "react-native-text-gradient";

const HomeUser = (props) => {
  return (
    <Background>
      <View style={{marginHorizontal: 40, marginVertical: 100 }}>
      <Text style={{color:'white', fontSize:40, marginBottom: 50}}>
        We are making photographs to understand what our lives mean to us</Text>
      {/* <Text style={{color:'white', fontSize:64, marginBottom: 40}}>Coding</Text> */}
      <Btn bgcolo={darkGreen} textColor={white} btnLabel="Login as User" Press={()=>props.navigation.navigate("LoginUser",{role: 'user'})}/>
      <Btn bgcolo={white} textColor={darkGreen} btnLabel="Signup as User" Press={()=>props.navigation.navigate("SignupUser", {role:'user'})}/>
      </View>
    </Background>
  )
}

export default HomeUser