import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesome, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';
import { colorSchema, styles as commonstyles } from '../../setup';
import { hideAsync } from 'expo-splash-screen';
import Message from '../../components/messagetoast';
import HomepageFoodItem from '../../components/HomePFoodItems';
import LottieView from 'lottie-react-native';

import Endpoints from '../../backend';

//this is basically the hompage by all items belong to a particular vendor

export default function FoodItemsofVendorScreen({ navigation, route }) {
  let counter = 0
  const [messages, setmessages] = useState([])
  const [categories, setCategories] = useState([])
  const [rating, setRating] = useState(null)

  const [popularItems, setPopularItems] = useState([])
  const [LatestItems, setLatestItems] = useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  let backendConnector = new Endpoints()

  //pull to refresh function
  const onRefresh = async function () {
    setRefreshing(true);
    await backendConnector.FoodItemsByVendor(setLatestItems, "Get", addMessage,route.params.vendorid)
    await backendConnector.FoodItemsByVendor(setPopularItems, "Post", addMessage,route.params.vendorid)
    setRefreshing(false)
  }

  //toast message
  function addMessage(message) {
    console.log("adding message")
    counter += 1
    setmessages(messages => [...messages, message])
    console.log(messages)
  }

  useEffect(() => {

    async function SetScreen() {

      await backendConnector.categoriesList(setCategories, addMessage)
      await backendConnector.FoodItemsByVendor(setLatestItems, "Get", addMessage, route.params.vendorid)
      await backendConnector.FoodItemsByVendor(setPopularItems, "Post", addMessage, route.params.vendorid)
    }
    SetScreen()
  }, [])






  return (
    <View style={styles.root} onLayout={async () => { await hideAsync() }}>


      <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
        {messages.map(m => {
          return (
            <Message
              //sending a message 
              key={counter + 1}
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
          <TouchableOpacity onPress={() => { navigation.goBack("MoreInfo") }}>
            <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
          </TouchableOpacity>
          <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 20, marginTop: 5 }]}>{route.params.vendorname} </Text>

        </View>
        <TouchableOpacity onPress={()=>{navigation.navigate("HomeStack", {screen:"Cart", initial: false,  })}} >
          <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

        </TouchableOpacity>

      </View>


      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => { await onRefresh() }}
            size={"large"}
            colors={[colorSchema.pink]}
            title={"refreshing"}
          />
        }
        style={{ marginTop: 20 }}
      >
        <View style={{ alignItems: 'center' }}>
          <LottieView
            autoPlay={true}
            loop={true}
            style={{ width: '60%' }}
            source={require('../../assets/lottiefiles/88782-women-cooking-in-kitchen.json')}

          ></LottieView>
          <View style={{position:"absolute",bottom:0,right:0,paddingHorizontal:20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((v, i) => {
              if (v <= rating) {
                return (
                  <TouchableOpacity key={i} onPress={() => { setRating(v); }}>
                    <FontAwesome name="star" size={19} color={colorSchema.pink} />
                  </TouchableOpacity>)
              } else {
                return (
                  <TouchableOpacity key={i} onPress={async () => {
                    setRating(v);
                    addMessage("Hold up")
                    await backendConnector.sendVendorRating(addMessage, v, route.params.vendorid)
                  }}>

                    <FontAwesome name="star-o" size={19} color={colorSchema.pink} />
                  </TouchableOpacity>)
              }
            })}
          </View>

        </View>

        <View style={[styles.Sections, { paddingLeft: 0 }]}>
          <View style={[styles.Sections, { paddingHorizontal: 18, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={[commonstyles.txt, { fontSize: 20 }]}>Popular Items</Text>
            <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 16, color: colorSchema.grey }]}>See All </Text>
          </View>
          {popularItems.length > 0 ?
            <FlatList
              data={popularItems}

              contentContainerStyle={{ marginLeft: 21, marginTop: 15 }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({ item }) => {
                return (
                  <HomepageFoodItem food={item} addMsgFunc={addMessage} navigation={navigation} />
                )
              }} />
            : <View style={{ alignItems: 'center' }}>
              <LottieView
                autoPlay={true}
                loop={true}
                style={{ width: '50%' }}
                source={typeof popularItems == "string" ? require(`../../assets/lottiefiles/84807-not-found-alt.json`) : require(`../../assets/lottiefiles/96231-loading-orange-animation.json`)}


              ></LottieView>
            </View>
          }

        </View>


        <View style={[styles.Sections, { paddingLeft: 0 }]}>

          <View style={[styles.Sections, { paddingHorizontal: 18, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={[commonstyles.txt, { fontSize: 20 }]}>New Items</Text>
            <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 16, color: colorSchema.grey }]}>See All </Text>
          </View>
          {LatestItems.length > 0 ?
            <FlatList
              data={LatestItems}

              contentContainerStyle={{ marginLeft: 21, marginTop: 15 }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({ item }) => {
                return (
                  <HomepageFoodItem food={item} addMsgFunc={addMessage} navigation={navigation} />
                )
              }} />
            : <View style={{ alignItems: 'center' }}>
              <LottieView
                autoPlay={true}
                loop={true}
                style={{ width: '50%' }}
                source={typeof LatestItems == "string" ? require(`../../assets/lottiefiles/84807-not-found-alt.json`) : require(`../../assets/lottiefiles/96231-loading-orange-animation.json`)}

              ></LottieView>
            </View>
          }
        </View>


      </ScrollView>
    </View>


  );

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
