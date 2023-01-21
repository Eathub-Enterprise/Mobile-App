import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, FlatList, Image, Animated, Modal, Pressable } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Endpoints from '../../backend';

//add message toast to display messages
export default function Cartscreen(props) {
    let counter = 0
    const [isrefreshing, setrefresh] = useState(false)
    const [messages, setmessages] = useState([])
    const [address, setAddress] = useState("")
    const [cart, setCart] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false)
    const [currentItem, setCurrentItem] = useState({})
    const [Title, setTitle] = useState("Cart")
    const scrolling = useRef(new Animated.Value(0)).current;
    const itemSize = 120 + 20 * 3
    const [showAnimation, setShowAnimation] = useState(false)
    let backendConnector = new Endpoints()

    function addMessage(message) {
        console.log("adding function")
        setmessages([message])
    }


    async function changeQuantity(action, itemid) {
        addMessage("Hold up")
        action == "inc" ?
            await backendConnector.inc_or_dc_Cart("Post", itemid, addMessage)
            : await backendConnector.inc_or_dc_Cart("Put", itemid, addMessage)
        await refreshCart()
    }





    useEffect(() => {
        async function SetScreen() {
            getCart()
        }
        SetScreen()
        console.log("Cart.js")
    }, [])

    async function Checkout() {
        if (address.length > 1) {
            await backendConnector.placeOrder(null, "Put", address)
        }
    }

    async function refreshCart() {
        let token = await AsyncStorage.getItem('token')
        //Get method returns list of items in desc order
        //Post method return list of highly rated items 

        const requestOptions = {
            method: "Get",
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },

        }
        //id of 1 is not important just to make the backend satisfied
        try {
            console.log("hey")
            let response = await fetch(`${process.env.PORT}api/v1/client/cart/1/`.trim(), requestOptions)
            let result = await response.json()

            console.log(result)
            if (result.message == "You have no cart") {
                setShowAnimation(true)
                setTitle("")
            } else if (result.items.length == 0) {
                setShowAnimation(true)
                setTitle("")
            }
            setCart(result)

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")

        }


    }


    async function getCart() {
        let token = await AsyncStorage.getItem('token')
        //Get method returns list of items in desc order
        //Post method return list of highly rated items 
        setrefresh(true)

        const requestOptions = {
            method: "Get",
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },

        }
        //id of 1 is not important just to make the backend satisfied
        try {
            console.log("hey")
            let response = await fetch(`${process.env.PORT}api/v1/client/cart/1/`.trim(), requestOptions)
            let result = await response.json()
            setrefresh(false)

            console.log(result)
            if (result.message == "You have no cart") {
                setShowAnimation(true)
                setTitle("")
            } else if (result.items.length == 0) {
                setShowAnimation(true)
                setTitle("")
            }
            setCart(result)

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
            setrefresh(false)

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
                            key={Math.floor(Math.random() * 9)}
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
                        <Text style={[commonstyles.header, { fontSize: 13, paddingHorizontal: 0, marginTop: 0, textAlign: 'center' }]}>{currentItem.description}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Ionicons name="ios-close-outline" size={24} color={colorSchema.white} />
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={checkoutModalVisible}

            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput placeholder={'Address'} style={styles.textinp} onChangeText={(txt) => { setAddress(txt) }} />
                        <TouchableOpacity onPress={async () => {
                            addMessage("Hold up")
                            await backendConnector.placeOrder(null, "Put", addMessage, "profile");
                            setTimeout(async () => {
                                await getCart();

                            }, 700)

                            setCheckoutModalVisible(false)
                        }}>
                            <Text style={[commonstyles.header, { fontSize: 13, paddingHorizontal: 0, marginTop: 0, marginBottom: 10, textAlign: 'center', color: colorSchema.pink }]}>or use address on profile</Text>

                        </TouchableOpacity>
                        {address.length > 0 ?
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={async () => {
                                    addMessage("Hold up");
                                    await backendConnector.placeOrder(null, "Put", addMessage, address);
                                    setTimeout(async () => {
                                        await getCart();

                                    }, 700)

                                    setCheckoutModalVisible(false)
                                }}
                            >
                                <Feather name="check" size={24} color={colorSchema.white} />
                            </Pressable> :
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => { setCheckoutModalVisible(false) }}
                            >
                                <Ionicons name="ios-close-outline" size={24} color={colorSchema.white} />
                            </Pressable>}
                    </View>
                </View>
            </Modal>

            <View style={[styles.header, { paddingHorizontal: colorSchema.padding }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}>{Title}</Text>

                </View>
                <>

                </>

            </View>

            {showAnimation == false ?
                <>
                    <Animated.FlatList
                        data={cart.items}
                        onRefresh={async () => getCart()}
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
                                    <TouchableOpacity style={[styles.cartItem]} onPress={() => { setCurrentItem(item); setModalVisible(true) }}>
                                        <View style={styles.cartItemLeft}>
                                            <View>
                                                <Text style={[commonstyles.header, { fontSize: 16, paddingHorizontal: 0, marginTop: 0 }]}>{item.item.food_title}</Text>
                                                <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 13, color: colorSchema.pink }]}> ₦ {item.totalPrice} </Text>
                                                <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 11, fontWeight: '300', color: colorSchema.grey }]}> fee included</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginBottom: 2 }} onPress={async () => {
                                                addMessage("Hold up")
                                                await backendConnector.deleteOrderItem(addMessage,item.id)
                                                setTimeout(async () => {
                                                    await getCart();
                    
                                                }, 700)
                                            }}>
                                                <Feather name="trash" size={22} color="black" />

                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.cartItemRight}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 30 }}>
                                                <TouchableOpacity style={styles.Greenbtn} onPress={async () => { await changeQuantity('dec', item.item.id) }}>
                                                    <Text style={styles.GreenbtnTxt}>-</Text>
                                                </TouchableOpacity>
                                                {item.using_pack_system == true ?
                                                    <Text style={[styles.GreenbtnTxt, { color: colorSchema.black }]}>{item.no_of_packs}</Text>
                                                    :
                                                    <Text style={[styles.GreenbtnTxt, { color: colorSchema.black }]}>{item.quantity}</Text>
                                                }
                                                <TouchableOpacity style={styles.Greenbtn} onPress={async () => { await changeQuantity('inc', item.item.id) }}>
                                                    <Text style={styles.GreenbtnTxt}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Image style={styles.foodImage} source={{ uri: item.item.image }} />
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            )
                        }}
                    />
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[commonstyles.txt, { fontSize: 18 }]}>Total Price</Text>
                            <Text style={[commonstyles.txt, { color: colorSchema.pink, fontSize: 18 }]}>₦ {cart.totalPrice}</Text>
                        </View>
                        <TouchableOpacity style={styles.placeOrderBtn} onPress={() => { setCheckoutModalVisible(true) }} >
                            <Text style={[commonstyles.txt, styles.normalTxt, {}]}> Place Order</Text>
                        </TouchableOpacity>

                    </View>
                </> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        style={{ width: '50%' }}
                        source={require('../../assets/lottiefiles/shaking-box.json')}
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
    cartItemLeft: {

        justifyContent: 'space-between'
    },
    cartItemRight: {
        flexDirection: "row",
    },
    Greenbtn: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#1DA634',
        justifyContent: 'center',
        alignItems: 'center'
    },
    GreenbtnTxt: {
        color: '#fff',
        fontFamily: 'reg',
        marginHorizontal: 7
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
    placeOrderBtn: {
        marginBottom: 5,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorSchema.pink
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    textinp: {
        width: 250,
        backgroundColor: '#fff',
        paddingVertical: 9,
        paddingHorizontal: 9,
        borderRadius: 15,
        elevation: 1,
        marginTop: 12,
        borderColor: colorSchema.pink,
        borderWidth: 0.5,
        marginBottom: 12,
        fontFamily: 'reg'
    },

});
