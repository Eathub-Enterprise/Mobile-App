import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, FlatList, Image, Animated, ImageBackground, Modal, Pressable, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Endpoints from '../../backend';
import QRCode from 'react-native-qrcode-svg';
let STATUS_COLOR = {
    accepted: "#19B85B",
    payed: "#19B85B",
    onroute: "#19B85B",
    //ordered: "#FF8C00", oranginsh color
    ordered: "#F6A608",
    declined: "#EA3C3D"
}

//add message toast to display messages
export default function OrderTrackerScreen(props) {
    const [currentItemStatus, setcurrentItemStatus] = useState("")
    const [currentItemid, setcurrentItemId] = useState(0)
    const [currentItem, setcurrentItem] = useState({})
    const [isrefreshing, setrefresh] = useState(false)
    const [messages, setmessages] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [food, setFood] = useState([])
    const [currentPage, setcurrentPage] = useState(1)
    const scrolling = useRef(new Animated.Value(0)).current;
    const itemSize = 120 + 20 * 3
    const [showAnimation, setShowAnimation] = useState(false)
    const [Header, setHeader] = useState("Track your orders")

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
        console.log(currentItemid)
        let me = 3
        if (currentItemStatus == "ordered") {
            return (
                <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>Note: Only ordered items accepted be
                    the vendor can be paid for.
                </Text>)
        } else if (currentItemStatus == "accepted") {
            return (<View>
                <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center", marginBottom: 5 }]}>Note: Your meal has been
                    acceptid by the vendor and is currently being prepared.
                </Text>
                <TouchableOpacity style={{ padding: 5, marginBottom: 5 }} onPress={() => {
                    setModalVisible(false);
                    props.navigation.navigate("More", { screen: "Payment", initial: false, params: { itemId: currentItemid } })
                }}>
                    <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.pink, textAlign: "center" }]}>Pay for item
                    </Text>
                </TouchableOpacity>
            </View>
            )
        } else if (currentItemStatus == "onroute") {

            return (
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <QRCode value={currentItemid.toString()} size={200} />

                    <TouchableOpacity style={{ padding: 5, marginTop: 5 }} onPress={() => {
                        //setModalVisible(false);
                        //props.navigation.navigate("More", { screen: "Payment", initial: false, params: { itemId: currentItemid } })
                    }}>
                        <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>
                            Note:The qr-code above would be scanned by the dispatch rider to cofirm delivery
                        </Text>
                    </TouchableOpacity>
                </View>
            )

        } else if (currentItemStatus == "payed") {

            return (

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <QRCode value={currentItemid.toString()} size={200} />
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
                    </TouchableOpacity >

                </View>
            )
        } else if (currentItemStatus == "delivered") {

            return (

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>
                        Note:This item has already been delivered and can be now be removed
                    </Text>

                    <TouchableOpacity style={{ padding: 5 }} onPress={async () => {
                        addMessage("Hold up")
                        await backendConnector.deleteOrderItem(addMessage, currentItemid);
                        setFood([])
                        setcurrentPage((cp) => 1)
                        await backendConnector.TrackOrder(setFood, "Get", addMessage, 1,
                            setcurrentPage, food, setrefresh, setHeader)
                        setModalVisible(false)
                    }}>
                        <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.pink, textAlign: "center" }]}>Clear from page
                        </Text>
                    </TouchableOpacity >

                </View>
            )
        } else {
            return (
                <View>

                    <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.black, textAlign: "center" }]}>Note: This order has been declined
                        by the vendor.
                    </Text>

                    <TouchableOpacity style={{ padding: 5 }} onPress={async () => {
                        addMessage("Hold up")
                        await backendConnector.deleteOrderItem(addMessage, currentItemid);
                        setFood([])
                        setcurrentPage((cp) => 1)
                        await backendConnector.TrackOrder(setFood, "Get", addMessage, 1,
                            setcurrentPage, food, setrefresh, setHeader)
                        setModalVisible(false)
                    }}>
                        <Text style={[styles.normalTxt, { fontSize: 15, fontFamily: 'reg', color: colorSchema.pink, textAlign: "center" }]}>Clear from page
                        </Text>
                    </TouchableOpacity >
                </View>

            )
        }
    }

    useEffect(() => {
        async function SetScreen() {
            await backendConnector.TrackOrder(setFood, "Get", addMessage, currentPage,
                setcurrentPage, food, setrefresh, setHeader
            )
        }
        SetScreen()


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
                            genModalText(currentItem.id)
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal2Visible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModal2Visible(!modal2Visible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={[commonstyles.header, { fontSize: 13, paddingHorizontal: 0, marginTop: 0, textAlign: 'center' }]}>{currentItem.description}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => { setModal2Visible(false) }}
                        >
                            <Ionicons name="ios-close-outline" size={24} color={colorSchema.white} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={[styles.header,]}>
                <View style={[]}>

                    <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 22, marginTop: 5 }]}>{Header}</Text>

                </View>
                <TouchableOpacity>

                </TouchableOpacity>
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
                                setcurrentPage, food, setrefresh, setHeader)
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

                                <Animated.View style={[]}>
                                    <TouchableOpacity
                                        onPress={() => { setcurrentItemStatus(item.status); setcurrentItemId(item.id); setModalVisible(true) }}
                                        onLongPress={() => { setcurrentItem(item); setModal2Visible(true) }}
                                    >
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
