import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { CONS } from '../Constant';

const MyBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false); // Loader state
    const IPaddress = CONS?.IPAddress;

    // Fetch user data and bookings
    const fetchUserData = async () => {
        setLoading(true); // Show loader
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post(`http://${IPaddress}:3000/userdata`, { token });
                setUserData(response.data.data);
                await fetchBookings(response.data.data._id); // Get bookings using userId
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Hide loader
            }
        }
    };

    const fetchBookings = async (userId) => {
        setLoading(true); // Show loader
        try {
            const response = await axios.get(`http://${IPaddress}:3000/my-bookings?userId=${userId}`);
            if (response.status === 200) {
                setBookings(response.data.data);
            } else {
                Alert.alert('Error', 'No bookings found.');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            Alert.alert('Error', 'Unable to fetch bookings at this time.');
        } finally {
            setLoading(false); // Hide loader
        }
    };

    const handleCancelBooking = async (bookingId) => {
        setLoading(true); // Show loader while canceling
        try {
            const userId = userData._id;

            const response = await axios.delete(`http://${IPaddress}:3000/cancel-booking`, {
                data: { userId, bookingId },
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
            <Text style={styles.photographerName}>{booking.photographerId ? booking.photographerId.name: 'Photographer Name'}</Text>
            <Text style={styles.bookingDate}>Date: {booking.date}</Text>
            <Text style={styles.bookingTime}>Time: {booking.time}</Text>
            <Text style={styles.bookingLocation}>Location: {booking.location}</Text>
            <Text style={styles.bookingStatus}>Status: {booking.status}</Text>
            <Button title="Cancel Booking" color="red" onPress={() => handleCancelBooking(booking._id)} />
        </View>
    );

    // Use useFocusEffect to fetch bookings when component gains focus
    useFocusEffect(
        useCallback(() => {
            fetchUserData(); // Re-fetch bookings when component comes into focus
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <>
                    <Text style={styles.title}>My Bookings</Text>
                    <FlatList
                        data={bookings}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <BookingCard booking={item} />}
                        ListEmptyComponent={<Text style={styles.noBookingsText}>No bookings found.</Text>}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    bookingCard: {
        padding: 16,
        backgroundColor: '#ccffff',
        borderRadius: 8,
        marginBottom: 12,
    },
    photographerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#202020"
    },
    bookingDate: {
        marginTop: 4,
        color: "#202020"
    },
    bookingTime: {
        marginTop: 4,
        color: "#202020"
    },
    bookingLocation: {
        marginTop: 4,
        color: "#202020"
    },
    bookingStatus: {
        marginTop: 4,
        fontStyle: 'italic',
        color: "#808080"
    },
    loader: {
        marginTop: '50%',
    },
    noBookingsText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});

export default MyBooking;
