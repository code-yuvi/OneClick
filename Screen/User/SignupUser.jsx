const {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
} = require('react-native');
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Error from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import axios from 'axios';
import { CONS } from '../Constant';
import BackImage from '../../Component/BackImage';


const SignupUser = (props) => {
    const [name, setName] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [lastName, setLastName] = useState('');
    const [lastNameVerify, setLastNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [contact, setContact] = useState('');
    const [contactVerify, setContactVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confPass, setConfPass] = useState('');

    const IPaddress = CONS?.IPAddress;


    const navigation = useNavigation();
    function handelSubmit() {
        const userdetails = {
            name: name,
            email,
            contact,
            password,
        };
        if (nameVerify && emailVerify && passwordVerify && contactVerify) {
            axios
                .post(`http://${IPaddress}:3000/registreUser`, userdetails)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == 'ok') {
                        Alert.alert('Registered Successfull!!');
                        navigation.navigate('LoginUser');
                    } else {
                        Alert.alert(JSON.stringify(res.data));
                    }
                })
                .catch(e => console.log(e));
        } else {
            Alert.alert('Fill mandatory details');
        }
    }

    function handleName(e) {
        const nameVar = e.nativeEvent.text;
        setName(nameVar);
        setNameVerify(false);

        if (nameVar.length > 1) {
            setNameVerify(true);
        }
    }

    function handleLastName(e) {
        const lastNameVar = e.nativeEvent.text;
        setLastName(lastNameVar);
        setLastNameVerify(false);
        if (lastNameVar.length > 1) {
            setLastNameVerify(true);
        }
    }
    function handleEmail(e) {
        const emailVar = e.nativeEvent.text;
        setEmail(emailVar);
        setEmailVerify(false);
        if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
            setEmail(emailVar);
            setEmailVerify(true);
        }
    }
    function handlecontact(e) {
        const contactVar = e.nativeEvent.text;
        setContact(contactVar);
        setContactVerify(false);
        if (/[6-9]{1}[0-9]{9}/.test(contactVar)) {
            setContact(contactVar);
            setContactVerify(true);
        }
    }
    function handlePassword(e) {
        const passwordVar = e.nativeEvent.text;
        setPassword(passwordVar);
        setPasswordVerify(false);
        if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
            setPassword(passwordVar);
            setPasswordVerify(true);
        }
    }
    function handleConfPassword(e) {
        const confPasswordVar = e.nativeEvent.text;
        setConfPass(confPasswordVar);
        setPasswordVerify(false);
        if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(confPasswordVar)) {
            setConfPass(confPasswordVar);
            setPasswordVerify(true);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={style.keyboard}>
        <BackImage>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0 )' }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}>
                    <View style={styles.logoContainer}>
                        
                    </View>
                    <View style={styles.loginContainer}>
                        <Text style={styles.text_header}>User Registeration!!!</Text>

                        <View style={style.actions}>
                            <FontAwesome
                                name="user-o"
                                color="#adebad"
                                style={styles.smallIcon}
                            />
                            <TextInput
                                placeholder="First Name"
                                placeholderTextColor="#bf80ff"
                                style={style.textInput}
                                onChange={e => handleName(e)}
                            />
                            {name.length < 1 ? null : nameVerify ? (
                                <Feather name="check-circle" color="green" size={20} />
                            ) : (
                                <Error name="error" color="red" size={20} />
                            )}
                        </View>
                        {name.length < 1 ? null : nameVerify ? null : (
                            <Text
                                style={{
                                    marginLeft: 20,
                                    color: 'red',
                                }}>
                                Name sholud be more then 1 characters.
                            </Text>
                        )}


                        <View style={style.actions}>
                            <FontAwesome
                                name="user"
                                color="#adebad"
                                style={styles.smallIcon}
                            />
                            <TextInput
                                placeholder="Last Name"
                                placeholderTextColor="#bf80ff"
                                style={styles.textInput}
                                onChange={e => handleLastName(e)}
                            />
                            {lastName.length < 1 ? null : lastNameVerify ? (
                                <Feather name="check-circle" color="green" size={20} />
                            ) : (
                                <Error name="error" color="red" size={20} />
                            )}
                        </View>

                        {lastName.length < 1 ? null : lastNameVerify ? null : (
                            <Text
                                style={{
                                    marginLeft: 20,
                                    color: 'red',
                                }}>
                                Name sholud be more then 1 characters.
                            </Text>
                        )}

                        <View style={style.actions}>
                            <Fontisto
                                name="email"
                                color="#adebad"
                                size={24}
                                style={{ marginLeft: 0, paddingRight: 5 }}
                            />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#bf80ff"
                                style={styles.textInput}
                                onChange={e => handleEmail(e)}
                            />
                            {email.length < 1 ? null : emailVerify ? (
                                <Feather name="check-circle" color="green" size={20} />
                            ) : (
                                <Error name="error" color="red" size={20} />
                            )}
                        </View>
                        {email.length < 1 ? null : emailVerify ? null : (
                            <Text
                                style={{
                                    marginLeft: 20,
                                    color: 'red',
                                }}>
                                Enter Proper Email Address
                            </Text>
                        )}
                        <View style={style.actions}>
                            <FontAwesome
                                name="mobile"
                                color="#adebad"
                                size={35}
                                style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }}
                            />
                            <TextInput
                                placeholder="contact"
                                placeholderTextColor="#bf80ff"
                                style={styles.textInput}
                                onChange={e => handlecontact(e)}
                                maxLength={10}
                            />
                            {contact.length < 1 ? null : contactVerify ? (
                                <Feather name="check-circle" color="green" size={20} />
                            ) : (
                                <Error name="error" color="red" size={20} />
                            )}
                        </View>
                        {contact.length < 1 ? null : contactVerify ? null : (
                            <Text
                                style={{
                                    marginLeft: 20,
                                    color: 'red',
                                }}>
                                Phone number with 6-9 and remaing 9 digit with 0-9
                            </Text>
                        )}
                        <View style={style.actions}>
                            <FontAwesome name="lock" color="#adebad" style={styles.smallIcon} />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#bf80ff"
                                style={styles.textInput}
                                onChange={e => handlePassword(e)}
                                secureTextEntry={showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {password.length < 1 ? null : !showPassword ? (
                                    <Feather
                                        name="eye-off"
                                        style={{ marginRight: -10 }}
                                        color={passwordVerify ? 'green' : 'red'}
                                        size={23}
                                    />
                                ) : (
                                    <Feather
                                        name="eye"
                                        style={{ marginRight: -10 }}
                                        color={passwordVerify ? 'green' : 'red'}
                                        size={23}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        {password.length < 1 ? null : passwordVerify ? null : (
                            <Text
                                style={{
                                    marginLeft: 20,
                                    color: 'red',
                                }}>
                                Uppercase, Lowercase, Number and 6 or more characters.
                            </Text>
                        )}

                        <View style={style.actions}>
                            <MaterialIcons name="password" color="#adebad" style={styles.smallIcon} />
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#bf80ff"
                                style={styles.textInput}
                                onChange={e => handleConfPassword(e)}
                                secureTextEntry={showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {confPass.length < 1 ? null : !showPassword ? (
                                    <Feather
                                        name="eye-off"
                                        style={{ marginRight: -10 }}
                                        color={passwordVerify ? 'green' : 'red'}
                                        size={23}
                                    />
                                ) : (
                                    <Feather
                                        name="eye"
                                        style={{ marginRight: -10 }}
                                        color={passwordVerify ? 'green' : 'red'}
                                        size={23}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        {confPass.length < 1 ? null : passwordVerify ? null : (
                            <Text
                                style={{
                                    marginLeft: 20,
                                    color: 'red',
                                }}>
                                Uppercase, Lowercase, Number and 6 or more characters.
                            </Text>
                        )}
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '92%',
                                paddingRight: 16,
                                marginTop: 20,
                            }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
                                By signing in, you agree to our{' '}
                            </Text>
                            <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 16 }}>
                                Terms & Conditions
                            </Text>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: "center",
                                width: '78%',
                                paddingRight: 16,
                                marginBottom: 10,
                                marginLeft: 40,
                            }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
                                and {" "}
                            </Text>
                            <Text style={{ color: "blue", fontWeight: 'bold', fontSize: 16 }}>
                                Privacy Policy
                            </Text>
                        </View>

                    </View>
                    <View style={style.button}>
                        <TouchableOpacity style={style.inBut} onPress={() => handelSubmit()}>
                            <View>
                                <Text style={styles.textSign}>Register</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", marginTop: 4 }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>Already Have Account?</Text>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('LoginUser')}>
                            <Text
                                style={{ color: '#2a79f7', fontWeight: 'bold', marginLeft: 10 }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </BackImage>
        </KeyboardAvoidingView> 
    );
}



const style = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        paddingTop: 10,
        // paddingBottom: 3,
        marginTop: 10,

        paddingHorizontal: 15,

        borderWidth: 1,
        borderColor: '#4d0099',
        borderRadius: 50,
        marginHorizontal: 10,
    },
    inBut: {
        width: '60%',
        backgroundColor: '#420475',
        alignItems: 'center',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 50,
        // size:80,
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        fontWeight: '500',
        color: 'white',
        
    },
    button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
        marginBottom: 0,
    },
    keyboard: {
        flex: 1,
    }
})

export default SignupUser