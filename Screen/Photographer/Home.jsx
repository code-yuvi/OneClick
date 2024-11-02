import { View, Text } from 'react-native'
import React from 'react'
import Background from '../../Component/Background'
// import Btn from './../Component/Btn'
import Btn from '../../Component/Btn'
import { darkGreen, white } from '../../assets/Color/Colors'
// import { LinearTextGradient } from "react-native-text-gradient";

const Home = (props) => {
  return (
    <Background>
      <View style={{marginHorizontal: 40, marginVertical: 100 }}>
      <Text style={{color:'white', fontSize:40, marginBottom: 50}}>
        We are making photographs to understand what our lives mean to us</Text>
      {/* <Text style={{color:'white', fontSize:64, marginBottom: 40}}>Coding</Text> */}
      <Btn bgcolo={darkGreen} textColor={white} btnLabel="Login" Press={()=>props.navigation.navigate("PhotoLogin",{role: 'photographer'})}/>
      <Btn bgcolo={white} textColor={darkGreen} btnLabel="Signup" Press={()=>props.navigation.navigate("SignupPhoto",{role: 'photographer'})}/>
      </View>
    </Background>
  )
}

export default Home