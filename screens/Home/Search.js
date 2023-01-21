import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, Switch, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import Endpoints from '../../backend';
import LottieView from 'lottie-react-native';


export default function SearchScreen(props) {
    const [food, setFood] = useState([])
    const [isrefreshing, setrefresh] = useState(false)
    const [currentPage, setcurrentPage] = useState(1)
    const [isEnabled, setIsEnabled] = useState(false);
    const [location, setLocation] = useState("same")

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
        console.log("adding message")
        counter += 1
    
        setmessages([message])
    
        console.log(messages)
      }

    useEffect(() => {
        async function SetScreen() {
            await backendConnector.SearchFood(setFood, "Get", addMessage, props.route.params.query,
                currentPage, setcurrentPage, food, setrefresh, location)
        }
        SetScreen()
    }, [])




    const [messages, setmessages] = useState([])

    let counter = 0

    async function LoadMore() {
        if (currentPage === 0) {
            addMessage("No more results")
        } else {
            await backendConnector.SearchFood(setFood, "Get", addMessage, props.route.params.query,
                currentPage, setcurrentPage, food, setrefresh, location)
        }

    }












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
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}>Search results</Text>

                </View>

                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#f4f3f4" }}
                        thumbColor={isEnabled ? colorSchema.pink : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <TouchableOpacity onPress={() =>
                        console.log(location)
                        //    props.navigation.push("Cart")
                    } >

                        <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

                    </TouchableOpacity>
                </View>


            </View>
            <View style={{ height: 30 }}></View>
            {
                food.length > 0 ?
                    <FlatList
                        onEndReached={async () => await LoadMore()}
                        onRefresh={async () => {
                            setFood([])
                            setcurrentPage((cp) => 1)
                            await backendConnector.SearchFood(setFood, "Get", addMessage, props.route.params.query,
                                1, setcurrentPage, food, setrefresh, location)
                        }
                        }
                        refreshing={isrefreshing}
                        onEndReachedThreshold={0}
                        data={food}
                        contentContainerStyle={{ paddingHorizontal: 40, alignContent: 'center', justifyContent: 'center' }}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => { props.navigation.push("FoodDetail", { item: item, vendor: item.vendor }) }}>
                                    <ImageBackground source={{ uri: item.image }} resizeMode="cover" style={styles.bgImage} imageStyle={{ borderRadius: 10 }} >
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={[commonstyles.txt, { color: colorSchema.white }]}>{item.food_title}</Text>
                                            <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 18 }]}> {item.vendor.vendorname}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16 }]}>{item.vendor.location}</Text>
                                                <View style={{ marginTop: 6, marginLeft: 5 }}>
                                                    <Ionicons name="location-sharp" size={13} color={colorSchema.white} />
                                                </View>
                                            </View>
                                            <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 15 }]}>{item.prepare_time} mins</Text>

                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>

                            )

                        }}

                    /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                        <LottieView
                            autoPlay={true}
                            loop={true}
                            style={{ width: '50%' }}
                            source={typeof food == "string" ? require(`../../assets/lottiefiles/84807-not-found-alt.json`) : require(`../../assets/lottiefiles/93816-loading.json`)}
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
        height: 200,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
