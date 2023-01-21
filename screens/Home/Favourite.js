import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, ActivityIndicator, ScrollView, Platform, Switch, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import Endpoints from '../../backend';
import LottieView from 'lottie-react-native';


export default function FavouriteMealsScreen(props) {
    const [food, setFood] = useState([])
    const [isrefreshing, setrefresh] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [location, setLocation] = useState("same")
    const [showAnimation, setShowAnimation] = useState(false)

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
        if (location == "same") {
            setLocation("all")
        } else {
            setLocation("same")
        }
        addMessage("Refresh page")

    }
    let backendConnector = new Endpoints()

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }

    useEffect(() => {
        async function SetScreen() {
            // await backendConnector.getFavouriteMeals(setFood, addMessage, props.route.params.categoryId, currentPage, setcurrentPage, food, setrefresh, location)
            await backendConnector.get_or_update_or_remove_FavouriteMeals(setFood, addMessage, "Get", setrefresh,null,setShowAnimation)
        }
        SetScreen()
    }, [])


    const [messages, setmessages] = useState([])

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
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}>Favourite Meals</Text>

                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                    <TouchableOpacity onPress={() => props.navigation.push("Cart")} >
                        <Ionicons name="cart-outline" size={26} color={colorSchema.black} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ height: 30 }}></View>
            {showAnimation == false ?
                <FlatList
                    onRefresh={async () => {
                        await backendConnector.get_or_update_or_remove_FavouriteMeals(setFood, addMessage, "Get", setrefresh)
                    }
                    }
                    refreshing={isrefreshing}
                    data={food}
                    contentContainerStyle={{ paddingHorizontal: 40, alignContent: 'center', justifyContent: 'center' }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={
                                    () => { props.navigation.push("FoodDetail", { item: item, vendor: item.vendor }) }
                                }
                                onLongPress={async () => {
                                    addMessage("Removing...")
                                    await backendConnector.get_or_update_or_remove_FavouriteMeals(null, addMessage, "Put", null, item.id)

                                    await backendConnector.get_or_update_or_remove_FavouriteMeals(setFood, addMessage, "Get", setrefresh)
                                }}>
                                <ImageBackground source={{ uri: item.image }} resizeMode="cover" style={styles.bgImage} imageStyle={{ borderRadius: 10 }} >
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={[commonstyles.txt, { color: colorSchema.white }]}>{item.food_title}</Text>
                                        <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 17 }]}> {item.vendor.vendorname}</Text>
                                        <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 15 }]}>{item.prepare_time} mins</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )
                    }}
                /> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        style={{ width: '50%' }}
                        source={require('../../assets/lottiefiles/shaking-box.json')}
                    ></LottieView>
                </View>}
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
        height: 200,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
