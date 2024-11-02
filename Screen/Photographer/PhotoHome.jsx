import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Button,
    Image,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';
import { CONS } from '../Constant';

const { width, height } = Dimensions.get('window');
const PhotoHome = () => {
    const [imageUri, setImageUri] = useState(null); // For selected image
    const [sliderImages, setSliderImages] = useState([]); // For all uploaded images
    const [userData, setUserData] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const flatListRef = useRef(null);
    const navigation = useNavigation();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

    const IPaddress = CONS?.IPAddress;


    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    async function getData() {
        const token = await AsyncStorage.getItem('token');
        // console.log(token);
        axios
            .post(`http://${IPaddress}:3000/photodata`, { token: token })
            .then(res => {
                // console.log(res.data);
                setUserData(res.data.data);
            })
            .catch(err => console.error('Error fetching user data:', err));
    }



    useEffect(() => {
        const fetchImages = async () => {
            if (!userData.email) {
                console.error('User email not available');
                return;
            }
            try {
                const response = await axios.post(`http://${IPaddress}:3000/get-images`, {
                    email: userData.email
                });
                setSliderImages(response.data.images); // Set images to slider
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (userData) {
            fetchImages();
        }
    }, [userData]);


    useEffect(() => {
        getData();
    }, []);


    // Select image from device
    const selectImage = () => {
        ImagePicker.launchImageLibrary(
            { mediaType: 'photo' },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.error('ImagePicker Error: ', response.error);
                } else {
                    const selectedImage = response.assets[0].uri;
                    setImageUri(selectedImage);
                }
            }
        );
    };

    // Upload selected image to the backend
    const uploadImage = async () => {
        if (!imageUri) {
            alert('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'upload.jpg',
        });

        if (userData && userData.email) {
            formData.append('email', userData.email); // Pass user's email
        }

        console.log('formData', formData)

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                `http://${IPaddress}:3000/uplode`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    'Authorization': `Bearer ${token}`,
                }
            );
            console.log('Image uploaded successfully:', response.data);
            const newImage = {
                url: response.data.imageUrl,  // Assuming backend returns the full URL
                _id: response.data.imageId || new Date().getTime().toString(), // Use returned id or a timestamp
            };
            console.log('Adding new image to sliderImages:', newImage);
            setSliderImages(prevImages => [...prevImages, newImage]); // Add the new image to the list
            navigation.reset({
                index: 0,
                routes: [{ name: 'PhotoHome' }],  // Assuming 'PhotoHome' is your current screen
            });
            setImageUri(null); // Reset imageUri after upload

        } catch (error) {
            console.error('Upload error:', error.response ? error.response.data : error.message);
        }
    };




    const handlePress = (uri) => {
        console.log('Image pressed:', uri);
        setSelectedImage(uri);
        setModalVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,  // Final scale value
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        // Reverse the scale animation
        Animated.spring(scaleAnim, {
            toValue: 0,  // Scale back to 0 when closing
            friction: 5,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));  // Close modal after animation
    };

    // Handle delete (if needed)
    const handleDeleteImage = async (id) => {
        try {
            const response = await axios.post(`http://${IPaddress}:3000/delete-image`, {
                email: userData.email,
                imageId: id
            });
            if (response.data.status === 'ok') {
                setSliderImages(sliderImages.filter(image => image._id !== id));
            } else {
                console.error('Error deleting image:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    // Render image slider
    const renderImageSlider = () => {
        if (sliderImages.length === 0) {
            return <Text style={styles.noImagesText}>No images uploaded yet</Text>;
        }
        console.log("Slider Images: ", sliderImages);
        return (
            <ScrollView horizontal>
                {sliderImages.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image.url }}
                        style={styles.sliderImage}
                    />
                ))}
            </ScrollView>
        );
    };


    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <Text style={styles.headerText}>My Collection</Text>
            </Animated.View>
            <View style={styles.centerSquare}>
                <FlatList
                    data={sliderImages} // Ensure sliderImages contains objects with 'id' and 'url'
                    ref={flatListRef}
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item._id ? item._id : index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handlePress(`http://${IPaddress}:3000/uploads/${item.filename}`)}>
                                <Image source={{ uri: `http://${IPaddress}:3000/uploads/${item.filename}` }} style={styles.userImage} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteImage(item._id)}
                            >
                                <Icon name="trash" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>


            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <Animated.View style={[styles.modalImageContainer, { transform: [{ scale: scaleAnim }] }]}>
                            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                        </Animated.View>
                    )}
                </View>
            </Modal>


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={selectImage}>
                    <Text style={styles.buttonText}>Select Image</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity>
            </View>

            {imageUri && (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>Selected Image</Text>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                </View>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8'
    },

    header: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        // marginBottom: 20,
        backgroundColor: '#E8A317', // Fallback color
        overflow: 'hidden', // Ensures children respect borderRadius
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },

    centerSquare: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    iconContainer: {
        width: width * 0.9,  // Full width of screen
        height: height * 0.6,  // Adjust height according to your needs
        justifyContent: 'center',
        alignItems: 'center',
    },
    userImage: {
        width: width * 0.8,
        height: height * 0.4,
        borderRadius: 10,
        borderWidth: 5,
        borderColor: '#C0C0C0',
    },
    deleteButton: {
        backgroundColor: '#FF5252',
        position: 'absolute',
        top: 20,
        right: 10,
        borderRadius: 20,
        padding: 5,
    },


    sliderContainer: {
        flex: 1,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    sliderImage: {
        width: 200,
        height: 200,
        marginRight: 10,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    previewTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    noImagesText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',  // Dim the background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImageContainer: {
        width: width * 0.9,  // Set width of modal image
        height: height * 0.7,  // Set height of modal image
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
    },
    closeText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default PhotoHome;
