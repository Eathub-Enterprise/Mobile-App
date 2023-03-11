import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, ImageBackground } from 'react-native';

import { colorSchema, styles as commonstyles } from '../setup';
import { hideAsync } from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoints from '../backend';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
export default function HomepageFoodItem(props) {
  let counter = 0
  let backendConnector = new Endpoints()
  const opacity = useRef(new Animated.Value(0)).current


  //pull to refresh function
  useEffect(() => {
    console.log(props.food)
    Animated.sequence([
      Animated.delay(300 * props.i),
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, bounciness: 10 })
    ]).start()
  }, [])





  return (
    <Animated.View style={
      {


        transform: [{
          translateX: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [65, 0],
          }),

        }],



        opacity,

        alignItems: 'center',
        marginRight: 10
      }}>
      <TouchableOpacity onPress={() => { props.navigation.push('FoodDetail', { item: props.food, vendor: props.food.vendor }) }}>

        <ImageBackground style={styles.foodImages} source={{ uri: props.food.image }} imageStyle={{ borderRadius: 11 }} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginTop: 5 }}>
            <View style={{ backgroundColor: colorSchema.lightgray, flexDirection: 'row', alignItems: 'center', borderRadius: 5, paddingHorizontal: 3,opacity:0.8 }}>

              <Ionicons name="ios-time-outline" size={20} color="black" />
              <Text style={{ fontFamily: 'reg', fontSize: 12, }}> {props.food.prepare_time}</Text>
            </View>
            <TouchableOpacity onPress={async()=>{
              props.addMsgFunc("chill")
              await backendConnector.get_or_update_or_remove_FavouriteMeals(null, props.addMsgFunc, "Post", null, props.food.id)
            }}>

              <FontAwesome name="heart-o" size={20} color={colorSchema.lightgray} />
            </TouchableOpacity>

          </View>

        </ImageBackground>
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={[commonstyles.txt, { fontFamily: 'medium', fontSize: 19 }]}>{props.food.food_title}</Text>
        <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 15, color: colorSchema.grey, marginTop: 3 }]}>₦{props.food.food_price}.00</Text>
        {props.food.food_type == "stand-alone" ?
          <TouchableOpacity
            onPress={async () => {
              await backendConnector.inc_or_dc_Cart("Post", props.food.id, props.addMsgFunc)
            }}
            style={{ width: 87, height: 33, backgroundColor: colorSchema.pink, alignItems: 'center', justifyContent: 'center', borderRadius: 11, marginTop: 7 }}>
            <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 16, color: colorSchema.white }]}>Add cart</Text>
          </TouchableOpacity>
          : null}
      </View>
    </Animated.View>
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
    width: 170,
    height: 200,
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
  }






})
