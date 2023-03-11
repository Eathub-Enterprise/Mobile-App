import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, Dimensions } from 'react-native';

import { colorSchema, styles as commonstyles } from '../setup';
import { hideAsync } from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoints from '../backend';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get("window")

export default function Slide(props) {
    let counter = 0
    let backendConnector = new Endpoints()
    const opacity = useRef(new Animated.Value(0)).current


    //pull to refresh function
    useEffect(() => {
        Animated.sequence([
            Animated.delay(300 * props.i),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, bounciness: 10 })
        ]).start()
    }, [])





    return (
        <Animated.View style={
            {


                transform: [{
                    translateX: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [65, 0],
                    }),

                }],



                opacity,
                width: width,
                alignItems: 'center',
                justifyContent: 'center',

            }}>
            <View style={{
                marginBottom: 20
            }}>
                <Image
                    source={props.item.file}
                    style={{ height: 300, width: width, resizeMode: "contain" }}
                />
            </View>

            <View style={{ paddingHorizontal: 21 }}>

                <Text style={styles.Titletext}>
                    {props.item.title}
                </Text>
                <Text style={styles.Descriptiontext}>
                    {props.item.description}
                </Text>
            </View>


        </Animated.View>
    )
}







const styles = StyleSheet.create({
    root: {
        flex: 1,

        paddingTop: StatusBar.currentHeight + 10,
        backgroundColor: colorSchema.white
    },
    banner: {
        width: 235,
        height: 111,
        borderRadius: 11,
        resizeMode: 'cover'
    },
    Sections: {
        marginTop: 15,
        paddingLeft: 21,
    },
    Titletext: {
        color: colorSchema.black,
        fontFamily: 'bold',
        textAlign: 'center',
        fontSize: 22

    },
    Descriptiontext: {
        color: colorSchema.black,
        fontFamily: 'reg',
        fontSize: 18,
        textAlign: 'center',
        width: 300,
        height: 69,
        marginTop: 32


    },
    continueBtnText: {
        color: colorSchema.white,
        fontFamily: 'reg',
        fontSize: 18,
    },

    search: {
        width: 334,
        height: 40,
        paddingLeft: 9,
        fontFamily: 'reg',
        fontSize: 16,
        backgroundColor: colorSchema.grey,
        marginTop: 15,
        borderRadius: 11

    },
    searchSection: {
        borderRadius: 11,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        paddingLeft: colorSchema.padding,
        backgroundColor: '#B0B0B0',

    }, searchBtn: {
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorSchema.pink
    }






})
