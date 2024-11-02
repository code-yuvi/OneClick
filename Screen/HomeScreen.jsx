import { StyleSheet, Image, Dimensions, Text, View, TouchableOpacity, ImageBackground, BackHandler, Alert } from "react-native";
import React, { useEffect } from 'react'
import Ic from "react-native-vector-icons/Entypo"
import Swiper from "react-native-swiper";



const w = Dimensions.get("window").width;
const h = Dimensions.get("window").height;

const HomeScreen = (props) => {

    return (
        <>
            <Swiper
                buttonWrapperStyle={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    flex: 1,
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                }}
                style={styles.wrapper}
                showsButtons={true}
                paginationStyle={{
                    marginRight: w * 0.7,
                    marginBottom: h * 0.02,
                }}
                activeDotColor="#8A56AC"
                dotColor="#998FA2"
                nextButton={
                    <View
                        style={{
                            height: 60,
                            borderRadius: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            width: 60,
                            backgroundColor: "#8A56AC",
                        }}
                    >
                        <Ic name="chevron-right" size={22} color="#FFF" />
                        {/* <Icon name="caretright" size={22} color="#FFF"/> */}

                    </View>
                }
                prevButton={
                    <View
                        style={{
                            height: 60,
                            borderRadius: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            width: 60,
                            backgroundColor: "#8A56AC",
                            marginHorizontal: 20,
                        }}
                    >
                        <Ic name="chevron-left" size={22} color="#FFF" />

                    </View>
                }
            >
                <View style={styles.slide}>
                    <Image source={require('./../assets/SlideImg/1stImg.jpg')} style={styles.img} />
                    <Text style={styles.title}>One-Click</Text>
                    <Text style={styles.text}>
                        “Only photography has been able to divide human life into a series of moments, each of them has the value of a complete existence.”
                    </Text>
                </View>
                <View style={styles.slide}>
                    <Image source={require('./../assets/SlideImg/2ndImg.jpeg')} style={styles.img} />
                    <Text style={styles.title}>Discover</Text>
                    <Text style={styles.text}>
                        “I don’t trust words. I trust pictures.”
                        –Gilles Peress
                    </Text>
                </View>

                <View style={styles.slide}>
                    <Image source={require('./../assets/SlideImg/3rdImg.jpg')} style={styles.img} />
                    <Text style={styles.title}>User-Friendly</Text>
                    <Text style={styles.text}>
                        Trustful to all users and understood by means of User Interface(UI).
                        Easy to accessable with well designed.
                    </Text>
                </View>
                <View style={styles.slide}>
                    <Image source={require('./../assets/SlideImg/4thImg.jpg')} style={styles.img} />
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.text}>

                    </Text>
                </View>

                <ImageBackground
                    source={require('./../assets/background.jpg')}
                    style={styles.background}
                >

                    <View style={styles.overlay}>

                        <Text style={styles.title2}>Login as</Text>

                        <View style={styles.optionsContainer}>
                            <ImageBackground source={require("./../assets/photograph.jpg")}
                                style={styles.image} >
                                <TouchableOpacity style={styles.option}
                                    onPress={() => props.navigation.navigate('Home')}>
                                    <Text style={styles.optionText}>PhotoGrapher</Text>
                                </TouchableOpacity>
                            </ImageBackground>

                            <ImageBackground source={require("./../assets/user.jpg")}
                                style={styles.image} >
                                <TouchableOpacity style={styles.option}
                                    onPress={() => props.navigation.navigate('HomeUser', { role: 'user' })}>
                                    <Text style={styles.optionText}>User</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                    </View>

                </ImageBackground>
            </Swiper>
        </>
    )
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        paddingTop: 80,
        marginHorizontal: 30,
    },
    img: {
        alignSelf: "center",
        borderTopRightRadius: 80,
        borderBottomLeftRadius: 80,
        height: h * 0.5,
        width: w * 0.9,
    },
    title: {
        fontFamily: "Montserrat_700Bold",
        marginTop: 60,
        marginHorizontal: 10,
        fontSize: 32,
    },
    text: {
        color: "#767676",
        fontFamily: "Montserrat_400Regular",
        marginTop: 20,
        fontSize: 16,
        lineHeight: 25,
        marginLeft: 10,
    },

    background: {
        flex: 1,
        resizeMode: 'cover',
    },

    overlay: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional overlay to make text more readable
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        // justifyContent: 'center',
        marginTop: 50,
        marginVertical: 10,
        alignItems: 'center',

    },
    title2: {
        // marginBottom: 20,
        fontFamily: "Montserrat_700Bold",
        marginTop: 60,
        marginHorizontal: 10,
        fontSize: 30,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.8)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        // backgroundColor: 'rgba(225, 255, 255, 0.2)',
        borderRadius: 15,
        paddingHorizontal: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        marginTop: 80,
        justifyContent: 'space-between',
        width: '80%',

    },
    option: {
        flex: 1,
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 10,
        // backgroundColor: '#f0f0f0',
        // borderWidth: 1,
        borderColor: '#000',
        // opacity: 0.1,

    },
    optionText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgba(255, 150, 0, 1)",

    },
    image: {
        width: 150,
        height: 200,
        resizeMode: 'contain',
        // borderTopRightRadius: 80,
        // borderBottomLeftRadius: 80,
    },
});


export default HomeScreen