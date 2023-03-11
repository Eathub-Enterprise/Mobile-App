import React, { useCallback, useEffect, useState, useRef } from 'react';
//importing dummy data for categories
import customdata from './data.json'
import { FontAwesome, Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';
import LottieView from 'lottie-react-native';
import { colorSchema, styles as commonstyles } from '../../setup';
import { hideAsync } from 'expo-splash-screen';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomepageFoodItem from '../../components/HomePFoodItems';
import Endpoints from '../../backend';
import moment from 'moment/moment';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

let backendConnector = new Endpoints()

let CATEGORY_IMAGES = [{ cat: "Fast food", img: require('../../assets/fastfood.png') },
{ cat: "Snacks", img: require('../../assets/vegetables.png') },
{ cat: "Breakfast", img: require('../../assets/breakfast.png') }
]

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});



function genCategoryImg(categoryName) {
  let catImgArr = CATEGORY_IMAGES.filter(v => v.cat == categoryName)
  return catImgArr[0].img
}
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default function HomeScreen({ navigation }) {
  let counter = 0
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [greeting, setGreeting] = useState("")
  const [messages, setmessages] = useState([])
  const [searchPlaceholder, setSearchPlaceHolder] = useState("")
  const [categories, setCategories] = useState(null)
  const [popularItems, setPopularItems] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [LatestItems, setLatestItems] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);
  const positioning = useRef(new Animated.Value(-10)).current
  const opacity = useRef(new Animated.Value(-10)).current
  const searchBarWidth = useRef(new Animated.Value(0)).current
  const searchBarHeight = useRef(new Animated.Value(0)).current
  const inputRange = [0, 1]
  const outputRange = [170, 350]


  useEffect(() => {
    //saving categories to state
    async function SetScreen() {


      await backendConnector.categoriesList(setCategories, addMessage)
      await backendConnector.GetFoodHomepage(setLatestItems, "Get", addMessage)
      await backendConnector.GetFoodHomepage(setPopularItems, "Post", addMessage)

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
      let token = await registerForPushNotificationsAsync()
      await backendConnector.saveToken(token, addMessage)


    }


    SetScreen()
    generateGreetings()
  }, [])



  useEffect(() => {
    if (searchQuery.length > 0) {
      Animated.sequence([
        Animated.delay(50),
        Animated.spring(opacity, { toValue: 1, useNativeDriver: false })
      ]).start()
    } else {
      Animated.sequence([
        Animated.delay(50),
        Animated.spring(opacity, { toValue: 0, useNativeDriver: false })
      ]).start()
    }
  }, [searchQuery])


  function generateGreetings() {
    var currentHour = moment().format("HH");
    if (currentHour >= 3 && currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour >= 12 && currentHour < 15) {
      setGreeting("Good afternoon");
    } else if (currentHour >= 15 && currentHour < 20) {
      setGreeting("Good evening");
    } else if (currentHour >= 20 && currentHour < 23) {
      setGreeting("Good night");
    } else {
      setGreeting("Hello")
    }
  }

  //pull to refresh function
  const onRefresh = async function () {
    setRefreshing(true);
    await backendConnector.categoriesList(setCategories, addMessage)
    await backendConnector.GetFoodHomepage(setLatestItems, "Get", addMessage)
    await backendConnector.GetFoodHomepage(setPopularItems, "Post", addMessage)
    setRefreshing(false)
  }


  //animate search bar width
  function AnimatesearchBar() {
    Animated.sequence([
      Animated.delay(10),
      Animated.spring(searchBarWidth, { toValue: 1, useNativeDriver: false, duration: 700 })
    ]).start()
    setSearchPlaceHolder("search...")

  }

  function deanimateSearchBar() {
    Animated.sequence([
      Animated.delay(50),
      Animated.spring(searchBarWidth, { toValue: 0, useNativeDriver: false, duration: 1000 })
    ]).start()
  }

  //toast message
  function addMessage(message) {
    console.log("adding message")
    counter += 1

    setmessages([message])

    console.log(messages)
  }







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


      <View style={[commonstyles.header, { marginTop: 0 }]}>
        <Text style={commonstyles.txt}>{greeting}</Text>
        <View style={commonstyles.subHeader}>
          <TouchableOpacity style={{ marginTop: 3, marginRight: 33 }} onPress={() => navigation.push("Favourite")}>
            <FontAwesome name="heart-o" size={22} color={colorSchema.black} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.push('Cart')
          }}>
            <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

          </TouchableOpacity>
        </View>
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
      >
        <View style={{ marginTop: 15 }}>
          <ScrollView
            horizontal={true}
            style={{ paddingLeft: colorSchema.padding }}
            showsHorizontalScrollIndicator={false}
          >
            <Image style={styles.banner} fadeDuration={400} source={require('../../assets/realbanner1.png')}></Image>
            <Image style={[styles.banner, { marginLeft: 16 }]} fadeDuration={400} source={require('../../assets/realbanner2.png')}></Image>
          </ScrollView>
        </View>
        <Animated.View style={{
          width: searchBarWidth.interpolate({
            inputRange,
            outputRange
          }),
          paddingHorizontal: colorSchema.padding,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          <TextInput
            onFocus={() => { AnimatesearchBar() }}
            onBlur={() => { deanimateSearchBar() }}
            placeholderTextColor={colorSchema.black}
            style={styles.search}
            placeholder={"search..."}
            onChangeText={(txt) => { setSearchQuery(txt) }}>

          </TextInput>
          <Animated.View style={{
            transform: [{
              translateY: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),

            }],

            transform: [{
              translateX: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [65, 0],
              }),

            }],
            opacity

          }}>

            <TouchableOpacity style={{ marginTop: 15, marginLeft: 20 }} onPress={() => {
              navigation.push("Search", { query: searchQuery })
              //schedulePushNotification().then(res => console.log(res))
            }}>
              <Ionicons name="md-search-outline" size={30} color={colorSchema.pink} />
            </TouchableOpacity>

          </Animated.View>


        </Animated.View>


        <View style={[styles.Sections, { paddingLeft: 0 }]}>
          <Text style={[commonstyles.txt, { fontSize: 20, paddingLeft: colorSchema.padding }]}>All Products</Text>
          {categories ?
            <FlatList
              data={categories}
              contentContainerStyle={{ marginLeft: 21, marginTop: 14 }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({ item }) => {
                return (<View style={{ marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={styles.catImgBorder}>
                    <TouchableOpacity style={{ marginBottom: 5, width: 60, height: 60, borderRadius: 325 }} onPress={() => { navigation.push("FoodByCategory", { "categoryId": item.id, "categoryTitle": item.title }) }}>
                      <Image style={styles.catImages} fadeDuration={400} source={genCategoryImg(item.title)} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[commonstyles.txt, { fontFamily: 'medium', fontSize: 14 }]}>
                    {item.title}
                  </Text>
                </View>)
              }}
            /> :
            <View style={{ alignItems: 'center' }}>
              <LottieView
                autoPlay={true}
                loop={true}
                style={{ width: '30%' }}
                source={require(`../../assets/lottiefiles/96231-loading-orange-animation.json`)}

              ></LottieView>
            </View>

          }

        </View>



        <View style={[styles.Sections, { paddingLeft: 0 }]}>
          <View style={[styles.Sections, { paddingHorizontal: 18, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={[commonstyles.txt, { fontSize: 20 }]}>Popular Items</Text>
            <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 16, color: colorSchema.grey }]}>See All </Text>
          </View>
          {popularItems ?
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
          {LatestItems ?
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

        <></>

      </ScrollView>
    </View>


  );

}
const styles = StyleSheet.create({
  root: {
    flex: 1,

    paddingTop: StatusBar.currentHeight + 5,
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
    resizeMode: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
  search: {
    height: 40,
    flex: 1,
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
  catImgBorder: {
    borderColor: colorSchema.black,
    padding: 2,
    borderRadius: 35,
    justifyContent: 'center',
    alignContent: 'center'
  }






})
