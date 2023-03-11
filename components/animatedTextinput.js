import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Modal, Keyboard, ActivityIndicator, ScrollView, Platform, Animated } from 'react-native';
import { colorSchema, styles as commonstyles } from '../setup';
import { FontAwesome, Ionicons, EvilIcons, Feather } from '@expo/vector-icons';

//import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AnimatedTextInput(props) {
    const positioning = useRef(new Animated.Value(0)).current




    let placeholders=["Username","Password","Email","First name","Middle name","Last name","Phone no","Address"]


    useEffect(() => {
        console.log(props.v)
    }, [])


    function AnimateInput() {
        Animated.sequence([
            Animated.spring(positioning, { toValue: 1, useNativeDriver: false })
        ]).start()
    }

    function deAnimateInput() {
        Animated.sequence([
            Animated.delay(100),
            Animated.spring(positioning, { toValue: 0, useNativeDriver: false })
        ]).start()
    }

    return (


        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            

        }}>
            {(props.userType=="Cash Agent" && props.v.pl=="Rate")|| (placeholders.includes(props.v.pl)) ?
            <Animated.View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                transform: [{
                    translateX: positioning.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -25],
                    }),

                }],

            }}>
                <TextInput placeholder={props.v.pl} style={[styles.textinp,

                ]} onChangeText={props.v.setter} onFocus={() => { AnimateInput() }} onBlur={() => { deAnimateInput() }} />
                {((props.v.pl == "Phone number" && props.v.st.length < 11) || (props.v.pl == "Rate" && props.v.st.length <3) || (props.v.pl == "Hostel" && props.v.st.length <2) || (props.v.pl == "Password" && props.v.st.length < 8) || (props.v.pl == "Confirm password" && props.v.st.length < 8) || (props.v.pl == 'Username' && props.v.st.length < 5) || (props.v.st.length < 2)) ?

                    <View style={[styles.ball,]}></View> : <View style={[styles.ball, { backgroundColor: colorSchema.white }]}></View>
                }
            </Animated.View>  : null}
        </View>



    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 5,


    },
    arrow: {
        paddingHorizontal: 30,
        paddingVertical: 5,
    },
    arrowbutton: {
        width: 80,
        paddingHorizontal: 20,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: '#ff7f50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'red',
        elevation: 5,

    },
    vhead: {
        paddingHorizontal: 21,
        paddingVertical: 30,
        marginTop: 65,

    },
    vtext: {
        fontWeight: 'bold',
        fontSize: 25,

    },
    vinput: {
        alignItems: 'center',
        paddingHorizontal: colorSchema.padding
    },
    textinp: {
        width: 250,
        backgroundColor: '#fff',
        paddingVertical: 9,
        paddingHorizontal: 9,
        borderRadius: 15,
        elevation: 1,
        marginTop: 5,
        borderColor: colorSchema.brown,
        borderWidth: 0.5,
        marginBottom: 12,
        fontFamily: 'reg'
    },
    continue2: {
        width: 100,
        height: 50,
        backgroundColor: colorSchema.brown,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1
    },
    continue: {
        width: 100,
        height: 50,
        backgroundColor: colorSchema.brown,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },

    btn: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff'
    },

    FG: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 7,
    },
    auth: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 45,
        elevation: 5
    },
    tauth: {
        fontWeight: 'bold',
        color: '#fff'

    },

    indicator: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    modalcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'


    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: 200,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#ff7f50',
        padding: 15,
        marginTop: 8,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 15,
    },
    ball: {
        width: 10,
        height: 10,
        backgroundColor: colorSchema.yellow,
        borderRadius: 8,
        marginLeft: 10
    }

});
