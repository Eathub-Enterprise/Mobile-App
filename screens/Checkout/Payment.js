import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import Endpoints from '../../backend';
import LottieView from 'lottie-react-native';
import { WebView } from 'react-native-webview';

//this is basically just a list of vendors

//i have not tested the loadMore functionality
let IMAGEBG_LOCATIONS = [require('../../assets/bg1.jpg'),
require('../../assets/bg2.jpg'),
require('../../assets/bg3.jpg'),
require('../../assets/bg4.jpg'),
require('../../assets/bg5.jpg'),
require('../../assets/bg6.jpg'),
require('../../assets/bg7.jpg'),
require('../../assets/bg8.jpg'),
require('../../assets/bg9.jpg'),

]
export default function PaymentScreen(props) {
    const [url, setUrl] = useState(null)

    let backendConnector = new Endpoints()

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }

    useEffect(() => {
        async function SetScreen() {
            await backendConnector.initiatePayment(setUrl, addMessage, props.route.params.itemId)
        }
        SetScreen()
    }, [])


    const [messages, setmessages] = useState([])



    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
                {messages.map(m => {
                    return (
                        <Message
                            //sending a message 
                            key={Math.floor(Math.random() * 20)}
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
                    <TouchableOpacity onPress={() => {props.navigation.goBack() }}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}>Make Payment </Text>

                </View>
                <TouchableOpacity >

                </TouchableOpacity>

            </View>
            <View style={{ height: 30 }}></View>

            {url ?
                <View style={{ flex: 1, }}>
                   <WebView  source={{uri: url}}
                    
                   />
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        style={{ width: '50%' }}
                        source={require('../../assets/lottiefiles/131000-money-transfer.json')}
                    ></LottieView>
                </View>

            }




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
    bgImage: {
        height: 210,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
