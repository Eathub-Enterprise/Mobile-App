import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';

import { colorSchema, styles as commonstyles } from '../setup';
import { hideAsync } from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoints from '../backend';

export default function SideDishItemList(props) {
    let counter = 0
    let backendConnector = new Endpoints()



    //pull to refresh function
    useEffect(() => {
        //console.log(props)
    }, [])


    function allMightyFunction(itemid, action, price) {
        console.log(price)
        if (action == "dec") {
            let sideDish = props.sideDishesOrderState.filter((v, i) => {
                if (v.id == itemid) {
                    return v
                }
            })
            if (sideDish.length > 0) {
                //if it is in the pack
                props.sideDishesOrderFunc((sideDishes) => {
                    let updatedSideDishes = sideDishes.map(v => {
                        //reducing the quantity
                        if (v.id == itemid) {
                            v.quantity -= 1

                        }
                        return v
                    })

                    updatedSideDishes = updatedSideDishes.filter(v => {
                        //removing the item that has a quantity of zero from the pack
                        if (v.quantity !== 0) {
                            return v

                        }
                    })
                    return updatedSideDishes
                })
            }

        } else {
            //checking if the item is already in the pack
            let sideDish = props.sideDishesOrderState.filter((v, i) => {
                if (v.id == itemid) {
                    return v
                }
            })
            if (sideDish.length == 0) {
                //if its not in the pack
                props.sideDishesOrderFunc((sideDishes) => [...sideDishes, { id: itemid, quantity: 1, totalPrice: 0, price:price }])
            } else {
                //if it is in the pack
                props.sideDishesOrderFunc((sideDishes) => {
                    console.log("Increasing quantity")
                    let updatedSideDishes = sideDishes.map((v, i) => {
                        if (v.id == itemid) {
                            v.quantity += 1
                        }
                        return v
                    })
                    return updatedSideDishes
                })
            }
        }
    }



    function displaySideItemQuantity(itemid) {
        let sideDishquantity = props.sideDishesOrderState.filter((v, i) => {
            v.totalPrice = 0
            v.totalPrice = (v.quantity * v.price)+v.totalPrice
            if (v.id == itemid) {
                return v
            }
        })
        if (sideDishquantity.length == 0) {
            return 0
        } else {
            return sideDishquantity[0].quantity

        }

    }


    return (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => console.log("hey")}>

                <Image style={styles.foodImages} source={{ uri: props.food.image }} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 17 }]}>{props.food.food_title}</Text>
                <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 15, color: colorSchema.grey }]}>₦{props.food.food_price}.00</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.Greenbtn} onPress={() => { allMightyFunction(props.food.id, "dec",props.food.food_price) }}>
                        <Text style={styles.GreenbtnTxt}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.GreenbtnTxt, { color: colorSchema.black }]}>{displaySideItemQuantity(props.food.id,)}</Text>
                    <TouchableOpacity style={styles.Greenbtn} onPress={() => { allMightyFunction(props.food.id,"inc",props.food.food_price) }}>
                        <Text style={styles.GreenbtnTxt}>+</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
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
    foodImages: {
        width: 162,
        height: 169,
        borderRadius: 10,
        resizeMode: 'center'
    },
    catImages: {
        width: 60,
        height: 60,
        borderRadius: 30,
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






})
