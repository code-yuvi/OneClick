import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    smallIcon: {
        marginRight: 10,
        fontSize: 24,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 200,
        width: 300,
        // marginTop: 20,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 108,
    },
    action: {
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 3,
        marginTop: 15,

        paddingHorizontal: 15,

        borderWidth: 1,
        borderColor: '#420475',
        borderRadius: 50,
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        color: 'white',
    },
    loginContainer: {
        // backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    text_header: {
        color: '#420475',
        fontWeight: 'bold',
        fontSize: 30,
    },
    button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
    },
    inBut: {
        width: '70%',
        backgroundColor: '#420475',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
    },
    inBut2: {
        backgroundColor: '#420475',
        // margin: 20,
        height: 60,
        width: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallIcon2: {
        fontSize: 40,
        // marginRight: 10,
    },
    bottomText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
})
export default styles;