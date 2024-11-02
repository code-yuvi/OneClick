// import React from 'react'
import { useRoute } from '@react-navigation/native';
import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ImageBackground, FlatList, Dimensions, Modal, Animated, Image, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CONS } from '../Constant';

function Profile() {
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState('');
    const [allUserData, setAllUserData] = useState('');
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const route = useRoute();

    const IPaddress = CONS?.IPAddress;

    const flatListRef = useRef(null);
    let currentIndex = 0;

    async function getAllData() {
        axios.get(`http://${IPaddress}:3000/get-user`).then(res => {
            console.log(res.data);
            setAllUserData(res.data.data);
        });
    }

    useEffect(() => {
        if (data.length > 0) {
            const interval = setInterval(() => {
                currentIndex += 1;
                if (currentIndex >= data.length) {
                    currentIndex = 0;
                }
                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
                }
            }, 3000); // Slide every 3 seconds

            return () => clearInterval(interval); // Cleanup the interval on unmount
        }
    }, [data]);

    const handlePress = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const handleAddImage = async () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const newImage = {
                    id: Date.now().toString(),
                    uri: response.assets[0].uri,
                };
                setData([...data, newImage]);
            }
        });
    };

    const selectPhoto = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            includeBase64: true,
            cropperCircleOverlay: true,
            avoidEmptySpaceAroundImage: true,
            freeStyleCropEnabled: true,
        }).then(image => {
            console.log(image);
            const data = `data:${image.mime};base64,${image.data}`;
            setImage(data);
        });
    };
    useEffect(() => {
        const userData = route.params.data;
        setEmail(userData.email);
        setImage(userData.image);
    }, []);
    return (
        <>


            <View style={styles.centerSquare}>
                <FlatList
                    data={data}
                    ref={flatListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handlePress(item.uri)}>
                                <Image source={{ uri: item.uri }} style={styles.userImage} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteImage(item.id)}
                            >
                                <Icon name="trash" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
                <Text style={styles.addButtonText}>Add Image</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#000',
    },
    topBar: {
        height: 80,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    gradientBackground: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    topBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 20,
    },
    centeredSection: {
        alignItems: 'center',
        // marginTop: 20, // Adjust margin for spacing from the top
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        // fontStyle: 'italic',
        color: '#ff8c00', // Vibrant color, or you can add a gradient
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
        fontFamily: '', // Add your custom font here
        letterSpacing: 2, // Optional: increase spacing for style
        marginBottom: 15,
    },
    centerSquare: {
        width: Dimensions.get('window').width * 0.8,
        aspectRatio: 1,
        //marginTop: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.8, // Ensures each icon occupies the full width of the square
    },
    userImage: {
        width: 250,
        height: 250,
        borderRadius: 10,
        margin: 10,
    },
    deleteButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        padding: 5,
        borderRadius: 10,
    },
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#50E3C2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomBar: {
        height: 80,
        justifyContent: 'flex-end',
    },
    bottomBarGradient: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
    },
    bottomBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#50E3C2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    arrowButton: {
        padding: 10,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalCloseArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        width: 350,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
});

export default Profile