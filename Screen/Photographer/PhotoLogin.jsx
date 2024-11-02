
const {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} = require('react-native');
import { useNavigation } from '@react-navigation/native';
import styles from './styles.js';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { log } from 'react-native-reanimated';
import Background from './../../Component/Background'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONS } from '../Constant.tsx';

const PhotoLogin = (props) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const IPaddress = CONS?.IPAddress;


    function handleSubmit() {
        console.log(email, password);
        const photographerdata = {
            email: email,
            password: password,
        }

        axios.post(`http://${IPaddress}:3000/loginPhotographer`, photographerdata)
            .then(res => {
                console.log(res.data)
                if (res.data.status == "ok") {
                    Alert.alert("Logged In Successfull");
                    AsyncStorage.setItem('token', res.data.data);
                    AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                    AsyncStorage.setItem('userType', 'photographer');
                    setTimeout(() => {
                        navigation.replace("DrawerNav");   
                    }, 100);
                }
                else {
                    Alert.alert("User dosen't exist!!");
                }
            })
            .catch(error => console.log(error));
    }
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={'always'}>
            <Background>
                <View>
                    {/* View style={{backgroundColor: 'white'}} */}
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={require('./../../assets/Logo-removebg-preview.png')}
                        />
                    </View>
                    <View style={styles.loginContainer}>
                        <Text style={styles.text_header}>Login Photo!!!</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#420475"
                                style={styles.smallIcon}
                            />
                            <TextInput
                                placeholder="Mobile or Email"
                                placeholderTextColor="#787777"
                                style={styles.textInput}
                                onChange={e => setEmail(e.nativeEvent.text)}
                            />
                        </View>
                        <View style={styles.action}>
                            <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#787777"
                                style={styles.textInput}
                                onChange={e => setPassword(e.nativeEvent.text)}
                            />
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                marginTop: 8,
                                marginRight: 10,
                            }}>
                            <Text style={{ color: '#420475', fontWeight: '700' }}>
                                Forgot Password
                            </Text>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
                            <View>
                                <Text style={styles.textSign}>Log in</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ padding: 15 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#919191' }}>
                                ----Or Continue as----
                            </Text>
                        </View>
                        <View style={styles.bottomButton}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity style={styles.inBut2}>
                                    <FontAwesome
                                        name="user-circle-o"
                                        color="white"
                                        style={styles.smallIcon2}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.bottomText}>Guest</Text>
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity
                                    style={styles.inBut2}
                                    onPress={() => {
                                        navigation.navigate('SignupPhoto');
                                    }}>
                                    <FontAwesome
                                        name="user-plus"
                                        color="white"
                                        style={[styles.smallIcon2, { fontSize: 30 }]}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.bottomText}>Sign Up</Text>
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity
                                    style={styles.inBut2}
                                    onPress={() => Alert('Coming Soon')}>
                                    <FontAwesome
                                        name="google"
                                        color="white"
                                        style={[styles.smallIcon2, { fontSize: 30 }]}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.bottomText}>Google</Text>
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity
                                    style={styles.inBut2}
                                    onPress={() => Alert('Coming Soon')}>
                                    <FontAwesome
                                        name="facebook-f"
                                        color="white"
                                        style={[styles.smallIcon2, { fontSize: 30 }]}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.bottomText}>Facebook</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* <View style={{ alignItems: "center", width: 380 }}>
                    <Text style={{ color: white, fontSize: 64, fontWeight: "bold", marginVertical: 10 }}>Login</Text>
                    <View style={{
                        backgroundColor: white, height: 700, width: 380, borderTopLeftRadius: 100,
                        paddingTop: 100, alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 40, marginVertical: 10,
                            color: "#40280d",
                            fontWeight: "bold"
                        }}>Welcome Back</Text>
                        <Text style={{ fontSize: 20, color: "#70583b", fontWeight: "bold", marginBottom: 20 }}>Login to your account</Text>
                        <TextInput placeholder="Email / Username" keyboardType={"email-address"} style={{
                            padding: 10,
                            borderWidth: 1,
                            borderRadius: 30,
                            width: "80%",
                            backgroundColor: '#dddddd',
                            marginTop: 10
                        }} onChange={value => setEmail(value.nativeEvent.text)} />
                        <TextInput placeholder="Password" secureTextEntry={true} style={{
                            padding: 10,
                            borderWidth: 1,
                            borderRadius: 30,
                            width: "80%",
                            backgroundColor: '#dddddd',
                            marginTop: 10
                        }} onChange={value => setPassword(value.nativeEvent.text)} />
                        <View style={{ alignItems: 'flex-end', width: "80%", paddingRight: 16, marginBottom: 100 }}>
                            <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>Forget Password ?</Text>
                        </View>
                        <Btn textColor="white" bgcolo={darkGreen} btnLabel="Login" Press={() => handleSubmit()} />
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Don't have an account ? </Text>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
                                <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>Signup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> */}
            </Background>
        </ScrollView>
    )
}

export default PhotoLogin