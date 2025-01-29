import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import axios from 'axios';  
import { CONS } from '../Constant';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [userData, setUserData] = useState(null);
    const IPaddress = CONS?.IPAddress;  

    const fetchUserData = async () => {
        setLoading(true); // Show loader
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post(`http://${IPaddress}:3000/photodata`, { token });
                setUserData(response.data.data);
                await fetchPhotographerBookings(response.data.data._id); // Get bookings using userId
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Hide loader
            }
        }
    };
    
    const fetchPhotographerBookings = async (photographerId) => {
        setLoading(true); // Show loader
        try {
            const response = await axios.get(`http://${IPaddress}:3000/photo-bookings?photographerId=${photographerId}`);
            if (response.status === 200) {
                setBookings(response.data.data);
            } else {
                Alert.alert('Error', 'No bookings found.');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            Alert.alert('Error', 'Unable to fetch bookings at this time.');
        } finally {
            setLoading(false); 
        }
    };


    const handleConfirmBooking = async (bookingId) => {
        try {
            const response = await axios.post(`http://${IPaddress}:3000/update-booking-status`, {
                bookingId,
                status: 'confirmed',
            });
    
            if (response.status === 200) {
                // Update the local state to reflect the status change
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>   
                        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
                    )
                );
                Alert.alert('Success', 'Booking confirmed successfully.');
            }
            else {
                Alert.alert('Error', 'Failed to confirm the booking.');
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            Alert.alert('Error', 'An error occurred while confirming the booking.');
        }
    };
    
    const handleRejectBooking = async (bookingId) => {
        try {
            const response = await axios.post(`http://${IPaddress}:3000/update-booking-status`, {
                bookingId,
                status: 'rejected',
            });
    
            if (response.status === 200) {
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking._id === bookingId ? { ...booking, status: 'rejected' } : booking
                    )
                );
                Alert.alert('Success', 'Booking rejected.');
            } else {
                Alert.alert('Error', 'Failed to reject the booking.');
            }
        } catch (error) {
            console.error('Error rejecting booking:', error);
            Alert.alert('Error', 'An error occurred while rejecting the booking.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        setLoading(true); // Show loader while canceling
        try {
            const photographerId = userData._id;

            const response = await axios.delete(`http://${IPaddress}:3000/cancel-booking`, {
                data: { photographerId, bookingId },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Booking canceled successfully.');
                setBookings((prevBookings) =>
                    prevBookings.filter((booking) => booking._id !== bookingId)
                );
            } else {
                Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            Alert.alert('Error', 'An error occurred while canceling the booking.');
        } finally {
            setLoading(false); // Hide loader
        }
    };

    const BookingCard = ({ booking }) => (
        <View style={styles.bookingCard}>
            <Text style={styles.photographerName}>
                User: {booking.userId ? booking.userId.name : 'User Name'}
            </Text>
            <Text style={styles.bookingDate}>Date: {booking.date}</Text>
            <Text style={styles.bookingTime}>Time: {booking.time}</Text>
            <Text style={styles.bookingLocation}>Location: {booking.location}</Text>
            <Text style={styles.bookingStatus}>Status: {booking.status}</Text>
            <View style={styles.buttons}>
                <Button
                    title="Confirm Booking"
                    onPress={() => handleConfirmBooking(booking._id)}
                    disabled={booking.status === 'confirmed' || booking.status === 'rejected'}
                />
                <Button
                    title="Reject Booking"
                    onPress={() => handleRejectBooking(booking._id)}
                    disabled={booking.status === 'confirmed' || booking.status === 'rejected'}
                />
            </View>
            <Button title="Cancel Booking" color="red" onPress={() => handleCancelBooking(booking._id)} />
        </View>
    );

    useFocusEffect(
        useCallback(() => {
            fetchUserData(); 
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Photographer Bookings</Text>
            {loading ? (
                <Text>Loading bookings...</Text>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <BookingCard booking={item} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    bookingCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    photographerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#202020"
    },
    bookingDate: {
        fontSize: 16,
        marginVertical: 5,
        color: "#202020"
    },
    bookingTime: {
        fontSize: 16,
        marginVertical: 5,
        color: "#202020"
    },
    bookingLocation: {
        fontSize: 16,
        marginVertical: 5,
        color: "#202020"
    },
    bookingStatus: {
        fontSize: 16,
        marginVertical: 5,
        color: 'gray',
    },
    buttons: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default MyBookings;




    // const handleConfirmBooking = async (bookingId) => {
    //     try {
    //         setBookings(prevBookings =>
    //             prevBookings.map(booking =>
    //                 booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
    //             )
    //         );
    //         Alert.alert('Success', 'Booking confirmed.');
    //     } catch (error) {
    //         console.error('Error confirming booking:', error);
    //         Alert.alert('Error', 'An error occurred while confirming the booking.');
    //     }
    // };

    // const handleRejectBooking = async (bookingId) => {
    //     try {
    //         setBookings(prevBookings =>
    //             prevBookings.map(booking =>
    //                 booking._id === bookingId ? { ...booking, status: 'rejected' } : booking
    //             )
    //         );
    //         Alert.alert('Success', 'Booking rejected.');
    //     } catch (error) {
    //         console.error('Error rejecting booking:', error);
    //         Alert.alert('Error', 'An error occurred while rejecting the booking.');
    //     }
    // };