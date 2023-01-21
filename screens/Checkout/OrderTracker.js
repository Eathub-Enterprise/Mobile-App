import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, FlatList, Image, Animated, ImageBackground, Modal, Pressable, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Endpoints from '../../backend';

let STATUS_COLOR = {
    accepted: "#FF8C00",
    payed:"#C8F514",
    onroute: "#32CD32",
    //ordered: "#FF8C00", oranginsh color
    ordered:"#F6FF00",
    declined: "#FF4500"
}

//add message toast to display messages
export default function OrderTrackerScreen(props) {
    const [currentItemStatus, setcurrentItemStatus] = useState("")
    const [currentItemid, setcurrentItemId] = useState(0)
    const [isrefreshing, setrefresh] = useState(false)
    const [messages, setmessages] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [food, setFood] = useState([])
    const [currentPage, setcurrentPage] = useState(1)
    const scrolling = useRef(new Animated.Value(0)).current;
    const itemSize = 120 + 20 * 3
    const [showAnimation, setShowAnimation] = useState(false)

    let backendConnector = new Endpoints()

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }

    async function LoadMore() {
        if (currentPage === 0) {
            addMessage("No more results")
        } else {

            await backendConnector.TrackOrder(setFood, "Get", addMessage, currentPage,
                setcurrentPage, food, setrefresh)
        }

    }

    function genModalText() {
        console.log(currentItemStatus)
        if (currentItemStatus == "ordered") {
            return (
                <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>Note: Only ordered items accepted be
                    the vendor can be paid for.
                </Text>)
        } else if (currentItemStatus == "accepted") {
            return (<Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>Note: Your meal has been
                accepted by the vendor and is currently being prepared.
            </Text>)
        } else if (currentItemStatus == "onroute") {

            return (
                <TouchableOpacity style={{ padding: 5 }} onPress={() => { setModalVisible(false); props.navigation.push("Payment", { itemId: currentItemid }) }}>
                    <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.pink, textAlign: "center" }]}>Pay for item
                    </Text>
                </TouchableOpacity>
            )

        } else if (currentItemStatus == "payed") {

            return (
                <TouchableOpacity style={{ padding: 5 }} onPress={async () => {
                    addMessage("Hold up")
                    await backendConnector.deleteOrderItem(addMessage, currentItemid);
                    setFood([])
                    setcurrentPage((cp) => 1)
                    await backendConnector.TrackOrder(setFood, "Get", addMessage, 1,
                        setcurrentPage, food, setrefresh)
                    setModalVisible(false)
                }}>
                    <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.pink, textAlign: "center" }]}>Clear from page
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>Note: This order has been declined
                    by the vendor.
                </Text>
            )
        }
    }

    useEffect(() => {
        async function SetScreen() {
            await backendConnector.TrackOrder(setFood, "Get", addMessage, currentPage,
                setcurrentPage, food, setrefresh
            )
        }
        SetScreen()

        console.log("Cart.js")
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {
                            genModalText()
                        }
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Ionicons name="ios-close-outline" size={24} color={colorSchema.white} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={[styles.header, { paddingHorizontal: colorSchema.padding }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}>Track your orders</Text>

                </View>
                <>

                </>

            </View>

            {showAnimation == false ?
                <>
                    <Animated.FlatList
                        data={food}
                        onEndReached={async () => await LoadMore()}
                        onRefresh={async () => {
                            setFood([])
                            setcurrentPage((cp) => 1)
                            await backendConnector.TrackOrder(setFood, "Get", addMessage, 1,
                                setcurrentPage, food, setrefresh)
                        }}
                        refreshing={isrefreshing}
                        contentContainerStyle={{ marginTop: 14, backgroundColor: "#fff", }}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: {
                                    contentOffset: {
                                        y: scrolling,
                                    },
                                },
                            }],
                            { useNativeDriver: true },
                        )}

                        renderItem={({ item, index }) => {
                            const inputRange = [
                                -1, 0, itemSize * index, itemSize * (index + 2)
                            ]
                            const opacityInputRange = [
                                -1, 0, itemSize * index, itemSize * (index + 0.5)
                            ]
                            const scale = scrolling.interpolate({
                                inputRange,
                                outputRange: [1, 1, 1, 0]
                            })
                            const opacity = scrolling.interpolate({
                                inputRange: opacityInputRange,
                                outputRange: [1, 1, 1, 0]
                            })
                            return (

                                <Animated.View style={[{ transform: [{ scale }], opacity }]}>
                                    <TouchableOpacity onPress={() => { setcurrentItemStatus(item.status); setcurrentItemId(item.id); setModalVisible(true) }}>
                                        <ImageBackground source={{ uri: item.item.image }} resizeMode="cover" style={styles.bgImage} imageStyle={{ borderRadius: 10 }} >
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={[commonstyles.txt, { color: colorSchema.white }]}>{item.item.food_title}</Text>
                                                <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 18 }]}> {item.item.vendor.vendorname}   <MaterialCommunityIcons name="food-fork-drink" size={17} color={colorSchema.white} />
                                                </Text>

                                                <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 15 }]}>Total price : ₦{item.totalPrice} (fee included)</Text>
                                                {item.using_pack_system == true ?
                                                    <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 15 }]}>Quantity : {item.no_of_packs}  <MaterialCommunityIcons name="chart-bar-stacked" size={15} color={colorSchema.white} />
                                                    </Text> : <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 15 }]}>Quantity : {item.quantity}  <MaterialCommunityIcons name="chart-bar-stacked" size={15} color={colorSchema.white} />
                                                    </Text>
                                                }
                                                <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, textAlign: "center" }]}>{item.delivery_location}    <MaterialCommunityIcons name="truck-fast" size={15} color={colorSchema.white} />
                                                </Text>

                                            </View>
                                            <Text style={[commonstyles.txt, styles.status, { color: colorSchema.white, fontSize: 15, backgroundColor: STATUS_COLOR[item.status] }]}>{item.status}</Text>

                                        </ImageBackground>
                                    </TouchableOpacity>
                                </Animated.View>
                            )
                        }}
                    />

                </> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        autoPlay

                        source={require('../../assets/lottiefiles/123936-empty-ghost.json')}
                    />
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
        paddingHorizontal: 20,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cartItem: {
        marginTop: 16,
        paddingTop: 25,
        height: 136,
        backgroundColor: '#F1F1F1',
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingLeft: 17,
        borderRadius: 20,
        shadowColor: colorSchema.grey,
        elevation: 5,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    foodImage: {
        width: 105,
        height: 105,
        borderRadius: 11,
        resizeMode: 'center',
        elevation: 10


    },
    normalTxt: {
        fontFamily: 'bold',
        fontSize: 18,
        color: colorSchema.white,

    },
    bgImage: {
        height: 210,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    status: {
        position: "absolute",
        right: 0,
        top: 0,
        borderRadius: 2

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 23,
        height: 45,
        width: 45,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: colorSchema.pink,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
