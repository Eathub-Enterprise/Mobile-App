import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';

import { colorSchema, styles as commonstyles } from '../setup';
import { hideAsync } from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoints from '../backend';

export default function HomepageFoodItem(props) {
  let counter = 0
  let backendConnector = new Endpoints()



  //pull to refresh function
  useEffect(() => {
  }, [])





  return (
    <View style={{ alignItems: 'center', marginRight: 10 }}>
      <TouchableOpacity onPress={() => { props.navigation.push('FoodDetail', { item: props.food, vendor: props.food.vendor }) }}>

        <Image style={styles.foodImages} source={{ uri: props.food.image }} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 17 }]}>{props.food.food_title}</Text>
        <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 15, color: colorSchema.grey }]}>₦{props.food.food_price}.00</Text>
        {props.food.food_type == "stand-alone" ?
          <TouchableOpacity
            onPress={async () => {
              await backendConnector.inc_or_dc_Cart("Post", props.food.id, props.addMsgFunc)
            }}
            style={{ width: 87, height: 33, backgroundColor: colorSchema.pink, alignItems: 'center', justifyContent: 'center', borderRadius: 11 }}>
            <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 16, color: colorSchema.white }]}>Add cart</Text>
          </TouchableOpacity>
          : null}
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
  }






})
