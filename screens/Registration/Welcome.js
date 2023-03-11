import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slide from '../../components/Slide';

//add message toast to display messages
const { width, height } = Dimensions.get("window")
const slides = [
    {
        "id": 1,
        "title": "Browse Our extensive Restaurants and menus",
        "file": require('../../assets/onboarding1.png'),
        "description": "With Eathub, you can choose from a wide range of cuisines and dishes      "

    },
    {
        "id": 2,
        "title": "Place Your Order ",
        "file": require('../../assets/onboarding2.png'),
        "description": "Ordering is simple and convenient and you can track your order at all times"

    },
    {
        "id": 3,
        "title": "Get fast & safe delivery",
        "file": require('../../assets/onboarding3.png'),
        "description": "Our Team of Dedicated Drivers ensures that your meal arrive hot and freshh right at your doorstep"

    }
]
export default function Welcome(props) {
    const ref = useRef(null)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [messages, setmessages] = useState([])
    let pages = [
        { icon: 'dollar-sign', name: "Username", value: "Tylerthecreator1" },
        { icon: 'shopping-bag', name: "Email", value: "cc@gmailcom" },
        { icon: 'First ', name: "Phone number", value: "08058876058" },
        { icon: 'eye-off', name: "First name", value: "Erioluwa" },
        { icon: 'info', name: "Middle Name", value: "Samuel" },
        { icon: "log-out", name: "Last Name", value: "Abiodun" },
    ]
    let counter = 0

    function err(err) {
        console.log(err)
    }

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }


    useEffect(() => {
        async function Checkingtoken() {
            try {
                const value = await AsyncStorage.getItem('token')
                if (value !== null) {
                    console.log(value)

                    props.navigation.replace('TabNav', { "name": null })

                } else {
                    setLoggedIn(false)
                    console.log("You dont have an account boss")
                }
            } catch (e) {
                console.log(e)
                // error reading value
            }
        }
        Checkingtoken()
    }, [])



    const updateScrollIndex = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x
        const currentIndex = Math.round(contentOffsetX / width)
        console.log(currentIndex)
        setCurrentSlideIndex(currentIndex)
    }
    const goToNextSlide = () => {
        let nextslideindex = currentSlideIndex + 1
        if (nextslideindex != slides.length) {
            const offset = nextslideindex * width
            ref?.current.scrollToOffset({ offset })
            setCurrentSlideIndex(nextslideindex)
        }

    }



    //for skipping to homepage when logged in 

    return (
        <View style={styles.container} onLayout={async () => { await hideAsync() }}>
            <FlatList
                ref={ref}
                onMomentumScrollEnd={updateScrollIndex}
                data={slides}
                pagingEnabled
                contentContainerStyle={{ height: height * 0.69, marginTop: 5, }}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item }) => {
                    return (<Slide item={item} />)
                }}
            />
            <View style={{ height: height * 0.31, paddingHorizontal: 21, alignItems: 'center' }}>

                <View style={{ flexDirection: 'row', width: 80, justifyContent: 'space-between', }}>
                    {
                        slides.map((v, i) => {
                            return (
                                <View key={i} style={[styles.indicator, currentSlideIndex == i && {
                                    backgroundColor: colorSchema.pink
                                }]} />
                            )
                        })
                    }

                </View>
                {
                    currentSlideIndex == 2 ?
                        <TouchableOpacity style={styles.continue} onPress={() => { props.navigation.replace('Registration') }} >

                            <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                            >Get started</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.continue} onPress={() => { goToNextSlide() }} >

                            <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                            >Continue</Text>
                        </TouchableOpacity>
                }

                <Text style={[commonstyles.txt, { color: colorSchema.pink, fontSize: 16, fontFamily: 'reg', marginTop: 40 }]} onPress={() => { props.navigation.replace('Registration') }}> Skip</Text>
            </View>

        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        height: height
    },
    continue: {
        width: 320,
        height: 50,
        backgroundColor: colorSchema.pink,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 63
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    indicator: {
        width: 15,
        borderWidth: 1,
        height: 15,
        borderRadius: 7,



    }

});
