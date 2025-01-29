import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CONS } from '../Constant'
import { Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { TextInput } from 'react-native';
import { Alert } from 'react-native';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const HomeU = (props) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState('');
    const [allUserData, setAllUserData] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPhotographer, setSelectedPhotographer] = useState(null);
    const [isBookingModalVisible, setBookingModalVisible] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [location, setLocation] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // Format date to YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        setBookingDate(formattedDate);
        hideDatePicker();
    };


    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        const formattedTime = moment(time).format('HH:mm');  // Format time as HH:mm
        setBookingTime(formattedTime);
        hideTimePicker();
    };

    const scaleAnim = new Animated.Value(0);

    const IPaddress = CONS?.IPAddress;


    async function getAllData() {
        axios.get(`http://${IPaddress}:3000/get-all-photo`).then(res => {
            // console.log(res.data);
            setAllUserData(res.data.data);
        });
    }

    async function getData() {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        axios
            .post(`http://${IPaddress}:3000/userdata`, { token: token })
            .then(res => {
                console.log(res.data);
                setUserData(res.data.data);
            });
    }

    useEffect(() => {
        getAllData();
        getData()
    }, []);

    const handlePhotographerPress = (photographer) => {
        setSelectedPhotographer(photographer);
        setModalVisible(true);
    };

    const handleBookPress = () => {
        //console.log("Photographer data:", photographer);
        setBookingModalVisible(true);  // Open the booking modal
        setModalVisible(false);
        // console.log("Selected Photographer Data:", selectedPhotographer);
    };

    const handleConfirmBooking = async () => {

        if (!bookingDate || !bookingTime || !location) {
            Alert.alert('Error', 'Please fill all fields before confirming the booking.');
            return;
        }

        const formattedDate = moment(bookingDate).format('YYYY-MM-DD');
        const formattedTime = moment(bookingTime, 'HH:mm').format('hh:mm A');

        const bookingData = {
            photographerId: selectedPhotographer._id,  // Pass the photographer ID
            userId: userData._id,                   // Pass the logged-in user ID
            date: bookingDate,
            time: bookingTime,
            location,
        };
        console.log("Booking Data:", bookingData);

        try {
            const response = await axios.post(`http://${IPaddress}:3000/create-booking`, bookingData);

            if (response.status === 201) {
                Alert.alert(
                    'Booking Confirmed',
                    `Your booking with ${selectedPhotographer.name} is confirmed for ${formattedDate} at ${formattedTime} in ${location}.`
                );
                setBookingModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to confirm booking. Please try again.');
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            Alert.alert('Error', 'Could not confirm booking. Please try again.');
        }

        if (!selectedPhotographer || !selectedPhotographer.name) {
            Alert.alert("Photographer details are not available.");
            return;
        }

        console.log(`Booking details:  ${selectedPhotographer.name}`, {
            photographer: selectedPhotographer,
            date: bookingDate,
            time: bookingTime,
            location: location,
        });

        // Show confirmation alert
        Alert.alert(
            "Booking Confirmed", // Title of the alert
            `Your booking with ${selectedPhotographer.name} is confirmed for ${bookingDate} at ${bookingTime} in ${location}.`, // Message body
            [
                {
                    text: "OK", // Button text
                    onPress: () => {
                        setBookingModalVisible(false); // Close the booking modal
                        // Reset booking details
                        setBookingDate('');
                        setBookingTime('');
                        setLocation('');
                    },
                },
            ],
            { cancelable: false } // Prevents closing the alert by clicking outside
        );
    };

    const UserCard = ({ data }) => (

        <TouchableOpacity onPress={() => handlePhotographerPress(data)}>
            <View style={styles.card}>
                <Image source={{
                    uri:
                        data.image == "" || data.image == null
                            ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                            : data.image,

                }} style={styles.image} />
                <View style={styles.cardDetails}>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.email}>{data.email}</Text>
                    <Text style={styles.userType}>{data.userType}</Text>
                    <Text style={styles.modalContact}>📞 {data.contact || 'N/A'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    function signOut() {
        AsyncStorage.setItem('isLoggedIn', '');
        AsyncStorage.setItem('token', '');
        AsyncStorage.setItem('userType', '');
        // navigation.navigate("SignOut")
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignOut' }], // Replace with the name of the screen you want to go to
        });
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userType}>{userData.userType}</Text>
                </View>

                <FlatList data={allUserData}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (<UserCard data={item} />)}
                />


            </View>
            <Button
                mode="contained"
                onPress={() => signOut()}
                style={{
                    backgroundColor: '#0163d2',
                    width: '100%',
                    borderRadius: 0,
                    margin: 0,
                }}
                labelStyle={{ fontSize: 16 }}>
                Log Out
            </Button>

            {selectedPhotographer && (
                <Modal visible={isBookingModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Book {selectedPhotographer.name}</Text>
                            <Text style={styles.modalTitle}>
                                {selectedPhotographer ? `Book ${selectedPhotographer.name}` : 'Select a Photographer'}
                            </Text>
                            {/* <TextInput
                                placeholder="Date (YYYY-MM-DD)"
                                style={styles.input}
                                value={bookingDate}
                                onChangeText={setBookingDate}
                            /> */}
                            <View style={styles.datecontainer}>
                                <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                                    <Text style={styles.textBoxText}>
                                        {bookingDate || "Select Date (YYYY-MM-DD)"}
                                    </Text>
                                </TouchableOpacity>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            <View style={styles.datecontainer}>
                            <TouchableOpacity onPress={showTimePicker} style={styles.input}>
                                <Text style={styles.textBoxText}>
                                    {bookingTime || "Select Time (HH:MM)"}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={handleTimeConfirm}
                                onCancel={hideTimePicker}
                            />
                        </View>
                            <TextInput
                                placeholder="Location"
                                style={styles.input}
                                value={location}
                                onChangeText={setLocation}
                            />
                            <Button mode="contained" onPress={handleConfirmBooking}>
                                Confirm Booking
                            </Button>
                            <Button onPress={() => setBookingModalVisible(false)} color="red">
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
            )}

            {selectedPhotographer && (
                <Modal visible={modalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{
                                    uri:
                                        selectedPhotographer.image == "" || selectedPhotographer.image == null
                                            ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                                            : selectedPhotographer.image,
                                }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalName}>{selectedPhotographer.name}</Text>
                            <Text style={styles.modalEmail}>{selectedPhotographer.email}</Text>
                            <Text style={styles.modalUserType}>{selectedPhotographer.userType}</Text>
                            <Text style={styles.modalContact}>📞 {selectedPhotographer.contact || 'N/A'}</Text>
                            <Button mode="contained" onPress={handleBookPress} style={styles.bookButton}>
                                Book
                            </Button>
                            <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    )
}
const styles = StyleSheet.create({
    datecontainer: {
        marginVertical: 8,
    },
    textBoxText: {
        color: '#888', // Matches placeholder color
        fontWeight: "bold",
        fontSize: 16,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f8ff', // Light gradient-like background color
    },
    userInfo: {
        marginBottom: 20,
        alignItems: 'center',
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0163d2',
        marginBottom: 5,
    },
    userType: {
        fontSize: 18,
        color: '#555555',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderColor: '#0163d2',
        borderWidth: 2,
    },
    cardDetails: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#777777',
    },
    signOutButton: {
        backgroundColor: '#0163d2',
        width: '100%',
        borderRadius: 6,
        marginTop: 10,
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    modalImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderColor: '#0163d2',
        borderWidth: 2,
    },
    modalName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    modalEmail: {
        fontSize: 16,
        color: '#555555',
        marginBottom: 10,
    },
    modalUserType: {
        fontSize: 16,
        color: '#888888',
        marginBottom: 20,
    },
    modalContact: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    bookButton: {
        backgroundColor: '#4caf50',
        width: '100%',
        borderRadius: 6,
        marginVertical: 10,
        padding: 10,
    },
    closeButton: {
        backgroundColor: '#f44336',
        width: '100%',
        borderRadius: 6,
        marginVertical: 10,
        padding: 10,
    },
    input: {
        width: '100%',
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#f5f5f5',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

export default HomeU;