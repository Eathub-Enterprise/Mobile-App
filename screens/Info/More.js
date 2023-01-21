import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Modal, Keyboard, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';

//add message toast to display messages
export default function MoreInfoscreen(props) {


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
        { icon: 'shopping-bag', name: "My Orders", page: "OrderTracker" },
        { icon: 'user', name: "Profile", page: "Profile" },
        { icon: 'home', name: "Vendors", page: "ListOfVendors" },
        ,
        { icon: "log-out", name: "Logout", page: removeToken },
    ]
    let counter = 0

    function err(err) {
        console.log(err)
    }



    useEffect(() => {
        //if('username' in props.route.params){
        //addMessage(`${props.route.params.username} created`)
        let a = 2
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
            <View style={[styles.header, { paddingHorizontal: colorSchema.padding }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}> More</Text>

                </View>
                <TouchableOpacity>
                    <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

                </TouchableOpacity>

            </View>
            <View style={{ height: 30 }}></View>
            {
                pages.map((v, i) => {
                    return (
                        <TouchableOpacity key={i} onPress={async () => {
                            v.name == 'Logout' ?
                            await removeToken() :
                            props.navigation.push(v.page)
                        }} style={{ height: 80, borderRadius: 20, flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: colorSchema.padding + 4 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ width: 53, height: 53, borderRadius: 30, backgroundColor: colorSchema.lightgray, justifyContent: 'center', alignItems: 'center' }}>
                                    <Feather name={v.icon} size={24} color={'#4A4B4D'} />

                                </View>
                                <Text style={[commonstyles.txt, { fontSize: 16, fontFamily: 'reg', marginLeft: 18, color: '#110000B2' }]}>{v.name}</Text>
                            </View>

                            <Feather name='chevron-right' size={25} color={'#4A4B4D'} />


                        </TouchableOpacity>
                    )
                })
            }
            <Text style={[commonstyles.txt, styles.DescriptionTxt]}>
                <Feather name="info" size={16} color={colorSchema.grey} />  Tips: Turn on the switch to view vendors or
                meals in other locations. Long-press items in favourites page and page for tracking order to remove item.
            </Text>

        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 10,
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
        position: 'absolute',
        bottom: 0
    },

});
