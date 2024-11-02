import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


const Btn = ({ bgcolo, btnLabel, textColor, Press }) => {
    return (
        <TouchableOpacity onPress={Press} style={{ 
            backgroundColor: bgcolo, 
            borderRadius: 100, 
            alignItems: "center", 
            width:300, 
            paddingVertical: 5,
            opacity:0.8,
            marginVertical: 5
            }}>
            
            <Text style={{ fontWeight: "bold", 
            fontSize: 25, 
            color: textColor, 
            // textAlign: "center" 
            }}>{btnLabel}</Text>
        </TouchableOpacity>
    )
}

export default Btn