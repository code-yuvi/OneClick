import { View, ImageBackground } from 'react-native'
import React from 'react'

const BackImage = ({children}) => {
  return (
    <View>
      <ImageBackground source={require("./../assets/BackImage.jpg")} style={{ height: '100%'}} blurRadius={2}/>
      <View style={{position:"absolute"}}>{children}</View>
    </View>
  )
}

export default BackImage