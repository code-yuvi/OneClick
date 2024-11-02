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
import Background from './../../Component/Background'
import axios from 'axios';


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
                .post("http://192.168.1.36:3000/registreUser", userdetails)
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
        <Background>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/Logo-removebg-preview.png')}
                        />
                    </View>
                    <View style={styles.loginContainer}>
                        <Text style={styles.text_header}>Register!!!</Text>

                        <View style={style.actions}>
                            <FontAwesome
                                name="user-o"
                                color="#420475"
                                style={styles.smallIcon}
                            />
                            <TextInput
                                placeholder="First Name"
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
                                color="#420475"
                                style={styles.smallIcon}
                            />
                            <TextInput
                                placeholder="Last Name"
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
                                color="#420475"
                                size={24}
                                style={{ marginLeft: 0, paddingRight: 5 }}
                            />
                            <TextInput
                                placeholder="Email"
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
                                color="#420475"
                                size={35}
                                style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }}
                            />
                            <TextInput
                                placeholder="contact"
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
                            <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
                            <TextInput
                                placeholder="Password"
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
                            <MaterialIcons name="password" color="#420475" style={styles.smallIcon} />
                            <TextInput
                                placeholder="Confirm Password"
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
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>
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
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>
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
                        <Text >Already Have Account?</Text>
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
        </Background>
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
        borderColor: '#420475',
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
        color: 'black',
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







// const SignupUser = (props) => {

//     const [name, setName] = useState()
//     const [lastName, setLastName] = useState()
//     const [contact, setContact] = useState()
//     const [email, setEmail] = useState();
//     const [password, setPassword] = useState();
//     const [confPass, setConfPass] = useState();

//     const onCreateAccount = async () => {

//         if (!email && !password && !name && !lastName && !contact && !confPass) {

//             Alert.alert('Fill Details', 'Please fill all the fields', [
//                 {
//                     text: 'Cancel',
//                     onPress: () => console.log('Cancel Pressed'),
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'OK',
//                     onPress: () => console.log('OK Pressed')
//                 },
//             ]);
//             return;
//         }
//         if (password != confPass) {
//             Alert.alert('Password', 'Passwords do not match', [
//                 {
//                     text: 'Cancel',
//                     onPress: () => console.log('Cancel Pressed'),
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'OK',
//                 },
//             ]);
//             return;
//         }

//         const userdetails={
//             name: name,
//             lastName: lastName,
//             contact: contact,
//             email: email,
//             password: password,
//         }

//         axios.post("http://192.168.1.34:3000/registreUser", userdetails)
//         .then((res) => {console.log(res.data)
//         if(res.data.status=="ok"){
//             Alert.alert("Registration Succcessful")
//             props.navigation.navigate('Login')
//         }else{
//             Alert.alert(JSON.stringify(res.data));
//         }
//         })

//         .catch(error => console.log(error));
//     }

//     return (
//         <Background>
//             <View style={{ alignItems: "center", width: 380 }}>
//                 <Text style={{
//                     color: white,
//                     fontSize: 64,
//                     fontWeight: "bold",
//                     marginVertical: 10
//                 }}>Register</Text>
//                 <Text
//                     style={{
//                         color: 'white',
//                         fontSize: 19,
//                         fontWeight: 'bold',
//                         marginBottom: 20,
//                     }}>
//                     Create a new account
//                 </Text>

//                 <View style={{
//                     backgroundColor: white, height: 700, width: 380, borderTopLeftRadius: 100,
//                     paddingTop: 50, alignItems: 'center'
//                 }}>

//                     <TextInput style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         borderRadius: 30,
//                         width: "80%",
//                         backgroundColor: '#dddddd'
//                     }} placeholder='First Name'
//                         value={name}
//                         onChangeText={(value) => setName(value)}
//                     >
//                     </TextInput>
//                     <TextInput style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         borderRadius: 30,
//                         width: "80%",
//                         backgroundColor: '#dddddd',
//                         marginTop: 10
//                     }} placeholder='Last Name'
//                         value={lastName}
//                         onChangeText={(value) => setLastName(value)}
//                     >
//                     </TextInput>
//                     <TextInput style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         borderRadius: 30,
//                         width: "80%",
//                         backgroundColor: '#dddddd',
//                         marginTop: 10
//                     }} placeholder='Email / Username'
//                         keyboardType={'email-address'}
//                         value={email}
//                         onChangeText={(value) => setEmail(value)}
//                     >
//                     </TextInput>
//                     <TextInput style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         borderRadius: 30,
//                         width: "80%",
//                         backgroundColor: '#dddddd',
//                         marginTop: 10
//                     }} placeholder='Contact Number'
//                         keyboardType={'number'}
//                         value={contact}
//                         onChangeText={(value) => setContact(value)}
//                     >
//                     </TextInput>
//                     <TextInput style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         borderRadius: 30,
//                         width: "80%",
//                         backgroundColor: '#dddddd',
//                         marginTop: 10
//                     }} placeholder='Password'
//                         keyboardType={'Password'}
//                         secureTextEntry={true}
//                         value={password}
//                         onChangeText={(value) => setPassword(value)}
//                     >
//                     </TextInput>
//                     <TextInput style={{
//                         padding: 10,
//                         borderWidth: 1,
//                         borderRadius: 30,
//                         width: "80%",
//                         backgroundColor: '#dddddd',
//                         marginTop: 10
//                     }} placeholder='Confirm Password'
//                         keyboardType={'Password'}
//                         secureTextEntry={true}
//                         value={confPass}
//                         onChangeText={(value) => setConfPass(value)}
//                     >
//                     </TextInput>


//                     <View
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             width: '92%',
//                             paddingRight: 16,
//                             marginTop: 20,
//                         }}>
//                         <Text style={{ color: 'grey', fontSize: 16 }}>
//                             By signing in, you agree to our{' '}
//                         </Text>
//                         <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>
//                             Terms & Conditions
//                         </Text>
//                     </View>

//                     <View
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             justifyContent: "center",
//                             width: '78%',
//                             paddingRight: 16,
//                             marginBottom: 10
//                         }}>
//                         <Text style={{ color: 'grey', fontSize: 16 }}>
//                             and {" "}
//                         </Text>
//                         <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>
//                             Privacy Policy
//                         </Text>
//                     </View>
//                     {/* <Btn textColor="white" bgcolo={darkGreen} btnLabel="Signup" Press={() => { alert("Account Created"); props.navigation.navigate('Login'); }} /> */}
//                     <Button title="Signup" onPress={() => onCreateAccount()} />
//                     <View
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                         }}>
//                         <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
//                             Already have an account ?{' '}
//                         </Text>
//                         <TouchableOpacity
//                             onPress={() => props.navigation.navigate('Login')}>
//                             <Text
//                                 style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>
//                                 Login
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Background>
//     )
// }

export default SignupUser