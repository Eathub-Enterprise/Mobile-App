import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MoreInfoList from '../../components/MoreInfoList';

//add message toast to display messages
export default function MoreInfoscreen(props) {
    const opacity = useRef(new Animated.Value(0)).current

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }


    async function removeToken() {
        try {
            addMessage("Logging out")
            await AsyncStorage.removeItem('token')
            props.navigation.replace('RegistrationStack')
            console.log("removed token")
        } catch (err) {
            console.error(err)
        }
    }

    const [messages, setmessages] = useState([])
    let pages = [
        { icon: 'home', name: "Vendors", page: "ListOfVendors" },
        { icon: 'info', name: "About us", page: "AboutUs" },

        { icon: "log-out", name: "Logout", page: removeToken },
    ]
    let counter = 0

    function err(err) {
        console.log(err)
    }



    useEffect(() => {
        //if('username' in props.route.params){
        //addMessage(`${props.route.params.username} created`)
        Animated.sequence([
            Animated.delay(50),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, })
        ]).start()
        //}
    }, [])








    //for skipping to homepage when logged in 

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
                {messages.map(m => {
                    return (
                        <Message
                            //sending a message 
                            key={counter + 1}
                            message={m}
                            onHide={() => {
                                setmessages((messages) => messages.filter((currentMessage) => {
                                    currentMessage !== m

                                }
                                ))
                            }}
                        />

                    )
                })}
            </View>
            <View style={[styles.header, { paddingHorizontal: 20 }]}>
                <View style={[]}>

                    <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 22, marginTop: 5 }]}> More</Text>

                </View>
                <TouchableOpacity onPress={() => { props.navigation.navigate("HomeStack", { screen: "Cart", initial: false, }) }}>
                    <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

                </TouchableOpacity>

            </View>
            <View style={{ height: 30 }}></View>
            {
                pages.map((v, i) => {
                    return (
                        <MoreInfoList key={i} removeToken={removeToken} v={v} i={i} navigation={props.navigation} />
                    )
                })
            }
            <Animated.View style={{
                transform: [{
                    translateY: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                    }),

                }],

                transform: [{
                    translateX: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [65, 0],
                    }),

                }],



                opacity,
                position: 'absolute',
                bottom: 0
            }}>
                <Text style={[commonstyles.txt, styles.DescriptionTxt]}>
                    <Feather name="info" size={16} color={colorSchema.grey} />  Tips: Turn on the switch to view vendors or
                    meals in other locations. Long-press items in favourites page and page for tracking order to remove item.
                </Text>
            </Animated.View>


        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    DescriptionTxt: {
        fontFamily: 'reg',
        fontWeight: "500",
        fontSize: 10,
        color: colorSchema.grey,
        textAlign: 'center',
        paddingHorizontal: 40,

    },

});
