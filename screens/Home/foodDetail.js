import React, { useCallback, useEffect, useState } from 'react';
//importing dummy data for categories
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, StatusBar, ScrollView, FlatList, Modal, Pressable } from 'react-native';
import { colorSchema, styles as commonstyles } from '../../setup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Message from '../../components/messagetoast';
import Endpoints from '../../backend';
import SideDishItemList from '../../components/SideDishItems';
import LottieView from 'lottie-react-native';



export default function FoodDetailScreen({ route, navigation }) {
  let counter = 0
  const [rating, setRating] = useState(null)
  const [food, setFood] = useState({})
  const [vendor, setVendor] = useState({})
  const [messages, setmessages] = useState([])
  const [sideDishes, setside_dishes] = useState(null)
  //this is what i am sending to the endpoint 
  const [sideDishesOrder, setside_dishesOrder] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const [MsgCounter, setMsgCounter] = useState(1)
  const [quantity, setQuantity] = useState(1)
  let backendConnector = new Endpoints()

  useEffect(() => {
    async function SetScreen() {

      setFood(route.params.item)
      setVendor(route.params.vendor)
      if (route.params.item.food_type == "main-dish") {
        addMessage("Checking for side dishes")
        await backendConnector.GetSidedishes(setside_dishes, "Get", addMessage, route.params.item.vendor.id)
      }
    }
    SetScreen()
    

    console.log(`Inside th deatil ${route.params.item.vendor.vendorname}`)
    //saving categories to state
  }, [])

  function changeQuantity(action) {
    action == "inc" ?
      setQuantity(prevQuantity => prevQuantity + 1)
      : setQuantity(prevQuantity => prevQuantity - 1)

  }

  function calcPackTotal(mainDishPrice) {
    let sideDishesTotal = 0
    sideDishesOrder.map((v, i) => {
      sideDishesTotal += v.totalPrice
    })

    return (mainDishPrice * quantity) + sideDishesTotal
  }
  function addMessage(message) {
    console.log("adding message")
    counter += 1

    setmessages([message])

    console.log(messages)
  }


  async function getFood() {
    let token = await AsyncStorage.getItem('token')
    //Get method returns list of items in desc order
    //Post method return list of highly rated items 
    const requestOptions = {
      method: "Get",
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },

    }
    try {
      console.log("fetching")
      setFood({})
      setVendor({})
      let response = await fetch(`${process.env.PORT}api/v1/food/details/${route.params.item.id}/`.trim(), requestOptions)
      let result = await response.json()
      setFood(result)
      setVendor(result.vendor)

    } catch (err) {
      console.log(err)
      addMessage("Check Internet connection")
    }


  }




  return (
    <View style={styles.root} >

      <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
        {messages.map(m => {
          return (
            <Message
              //sending a message 
              key={counter}
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
      {//FOOD PIC BG
      }
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
            <FlatList
              data={sideDishes}

              contentContainerStyle={{ alignItems: 'center' }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: 10 }}>
                    <SideDishItemList food={item} addMsgFunc={addMessage} navigation={navigation} sideDishesOrderState={sideDishesOrder} sideDishesOrderFunc={setside_dishesOrder} />
                  </View>
                )
              }} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { console.log(sideDishesOrder); setModalVisible(false) }}
            >
              <Ionicons name="ios-close-outline" size={24} color={colorSchema.white} />
            </Pressable>
          </View>
        </View>
      </Modal>

      <ImageBackground
        source={{ uri: food.image }}
        imageStyle={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          resizeMode: 'cover',
        }}
        style={[{ flex: 1.5 }]}>


        <View style={[commonstyles.header, { marginTop: 0, paddingTop: StatusBar.currentHeight }]}>
          <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
          </TouchableOpacity>
          <View style={commonstyles.subHeader}>
            <TouchableOpacity style={{ marginTop: 3, marginRight: 13 }} onPress={async () => {
              addMessage("Chill...")
              await backendConnector.get_or_update_or_remove_FavouriteMeals(null, addMessage, "Post", null, food.id)
            }

            }>
              <FontAwesome name="heart-o" size={22} color={"black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {  navigation.push('Cart') }}>
              <Ionicons name="cart-outline" size={26} color={"black"} />

            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
      {//END OF FOOD BG
      }

      <View style={{ flex: 2, paddingHorizontal: 21 }}>
        <ScrollView>
          <View style={[commonstyles.header, { paddingHorizontal: 0 }]}>
            <Text style={[commonstyles.txt, { fontSize: 21 }]}>{food.food_title}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => { navigation.navigate("More", {screen:"FoodItemsofVendor", initial: false,  params:{vendorname: route.params.item.vendor.vendorname,vendorid:route.params.item.vendor.id}}) }}>

              <Text style={[commonstyles.txt, styles.DescriptionTxt,]}>
                <FontAwesome name="eye" size={15} color={colorSchema.grey} /> view vendor</Text>
            </TouchableOpacity>
            <View style={{}}>

              <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 16, color: colorSchema.pink }]}>₦{food.food_price}.00 </Text>
            </View>

          </View>
          <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 13, color: colorSchema.lightgray }]}>{food.total_rating} rating</Text>
              <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((v, i) => {
                  if (v <= food.total_rating) {
                    return (
                      <TouchableOpacity key={i} onPress={() => { setRating(v); }}>
                        <FontAwesome name="star" size={19} color={colorSchema.pink} />
                      </TouchableOpacity>)
                  } else {
                    return null
                  }


                })}
              </View>


            </View>
            {//RATING OF FOOD SYSTEM
            }
            <View>
              <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 13, color: colorSchema.lightgray }]}>Give your rating</Text>
              <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        addMessage("Chill...")
                        await backendConnector.sendFoodRating(addMessage, v, food.id)
                      }}>

                        <FontAwesome name="star-o" size={19} color={colorSchema.pink} />
                      </TouchableOpacity>)
                  }


                })}
              </View>

            </View>

          </View>
          <View style={[commonstyles.header, { paddingHorizontal: 0 }]}>
            <Text style={[commonstyles.txt, { fontSize: 18,fontFamily:'medium' }]}>Details</Text>
          </View>
          <View style={styles.DescriptionContainer}>
            <Text style={[commonstyles.txt, styles.DescriptionTxt]}>
              {food.food_description}
            </Text>
          </View>

          {sideDishes ?
            <TouchableOpacity style={styles.showSideDishesBtn} onPress={() => { setModalVisible(true) }}>
              <Text style={[commonstyles.txt, styles.normalTxt, { color: colorSchema.pink, fontSize: 14 }]}>
                show side dishes
              </Text>
            </TouchableOpacity>

            : <></>
          }
          {route.params.item.food_type == "stand-alone" ?
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[commonstyles.txt, styles.normalTxt, { marginRight: 8 }]}>Quantity</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.Greenbtn} onPress={() => { changeQuantity('dec') }}>
                    <Text style={styles.GreenbtnTxt}>-</Text>
                  </TouchableOpacity>
                  <Text style={[commonstyles.txt, styles.normalTxt, { marginHorizontal: 5 }]}>{quantity}</Text>
                  <TouchableOpacity style={styles.Greenbtn} onPress={() => { changeQuantity('inc') }}>
                    <Text style={styles.GreenbtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>


              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                <Text style={[commonstyles.txt, styles.normalTxt, { marginRight: 16 }]}>Total Price</Text>
                <Text style={[commonstyles.txt, styles.normalTxt, { color: colorSchema.pink, fontSize: 17 }]}>₦{(food.food_price * quantity)} + ₦{food.delivery_fee} fee</Text>
              </View>
              <TouchableOpacity style={styles.addToCartBtn} onPress={async () => { await backendConnector.inc_or_dc_Cart("Post", food.id, addMessage, quantity) }}>
                <Text style={[commonstyles.txt, styles.normalTxt, { color: "#fff" }]}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
            :
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[commonstyles.txt, styles.normalTxt, { marginRight: 8 }]}>Portion(s)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.Greenbtn} onPress={() => { changeQuantity('dec') }}>
                    <Text style={styles.GreenbtnTxt}>-</Text>
                  </TouchableOpacity>
                  <Text style={[commonstyles.txt, styles.normalTxt, { marginHorizontal: 5 }]}>{quantity}</Text>
                  <TouchableOpacity style={styles.Greenbtn} onPress={() => { changeQuantity('inc') }}>
                    <Text style={styles.GreenbtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>


              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                <Text style={[commonstyles.txt, styles.normalTxt, { marginRight: 16 }]}>Total Price</Text>
                <Text style={[commonstyles.txt, { color: colorSchema.pink, fontSize: 17, fontFamily: "reg" }]}>₦{calcPackTotal(food.food_price)} + ₦{food.delivery_fee} fee</Text>
              </View>

              <TouchableOpacity style={styles.addToCartBtn} onPress={async () => { await backendConnector.inc_or_dc_Cart("Post", food.id, addMessage, quantity, sideDishesOrder) }}>
                <Text style={[commonstyles.txt, styles.normalTxt, { color: "#fff" }]}>Create a pack</Text>
              </TouchableOpacity>
            </View>

          }
        </ScrollView>
      </View>



    </View>



  );

}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  DescriptionContainer: {
    height: 130
  },
  DescriptionTxt: {
    fontFamily: 'reg',
    fontWeight: "500",
    fontSize: 13,
    color: colorSchema.grey
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
  normalTxt: {
    fontFamily:'medium',
    fontSize: 16,
  },
  addToCartBtn: {
    backgroundColor: colorSchema.pink,
    width: 161,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 20
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
  showSideDishesBtn: {
    borderBottomColor: colorSchema.pink, 
    marginBottom:10,
    borderBottomWidth: 1
  }



})
