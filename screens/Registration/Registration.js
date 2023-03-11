import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Modal, Keyboard, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


const locations = [{ id: 1, name: "Lekki" }, { id: 2, name: "Ikeja" }, { id: 3, name: "Agege" }]

//The inputs are displayed in a for loop
//Its only the important fields that are being displayed
export default function Registrationscreen({ navigation }) {

  const [username, setusername] = useState('')
  const [address, setAddress] = useState('')
  const [email, setemail] = useState('')
  const [phonenumber, setphonenumber] = useState('')
  const [firstname, setfirstname] = useState('')
  const [middlename, setmiddlename] = useState("")
  const [lastname, setlastname] = useState("")
  const [gender, setGender] = useState('M')
  const [location, setLocation] = useState("Lekki")
  const [emptyFields, setEmptyFields] = useState([])
  const [visible, setvisible] = useState(false)
  const [indicatorVisible, setIndicatorVisible] = useState(false)
  const [password, setpassword] = useState('')
  const [messages, setmessages] = useState([])
  const [loggedIn, setLoggedIn] = useState(true)


  let counter = 0
  let states = [

    { pl: 'Email', setter: setemail, st: email },
    { pl: 'Username', setter: setusername, st: username },
    { pl: 'Phone no', setter: setphonenumber, st: phonenumber },
    { pl: 'Full name', setter: setfirstname, st: firstname },
    { pl: 'Address', setter: setAddress, st: address },
    { pl: 'Password', setter: setpassword, st: password },


  ]


  useEffect(() => {
    async function Checkingtoken() {
      try {
        const value = await AsyncStorage.getItem('token')
        if (value !== null) {
          console.log(value)

          navigation.replace('TabNav', { "name": null })

        } else {
          setLoggedIn(false)
          console.log("You dont have an account boss")
        }
      } catch (e) {
        console.log(e)
        // error reading value
      }
    }
    Checkingtoken()
  }, [])


  function addMessage(message) {
    console.log("adding function")
    setmessages(messages => [...messages, message])
    console.log(messages)
  }





  //conneting to my api
  async function Registerapi() {
    setIndicatorVisible(true)
    console.log({ username, password, gender, firstname, lastname, middlename, phonenumber, email, address, location })
    const requestOptions = {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, gender, firstname, lastname, middlename, phonenumber, email, address, location })
    }
    try {
      let response = await fetch('https://emachine.pythonanywhere.com/api/v1/user/create/client/', requestOptions)
      let result = await response.json()
      console.log(result)
      setIndicatorVisible(false)
      if (result.message == "added_succesfully") {
        addMessage('Account Created')
        setTimeout(() => {
          navigation.push('Login', { username }), 900
        })

      } else {
        addMessage(result.message)
      }


    } catch (err) {
      console.log(err)
      setIndicatorVisible(false)
      addMessage("Check Internet connection")
    }





  }

  //for skipping to homepage when logged in 
  if (loggedIn) {
    return null;
  }


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >

      <View style={styles.container} onLayout={async () => { await hideAsync() }}>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
        >
          <View style={styles.modalcontainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{messages}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setvisible(!visible)}>
                <Text style={styles.textStyle}>close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView>

          <View style={styles.vhead}>
            <Text style={[commonstyles.txt, { fontSize: 24, }]}>Get started</Text>
            <Text style={[commonstyles.txt, { fontSize: 16, fontFamily: "reg" }]}>kindly create an account</Text>

          </View>

          <View style={styles.vinput}>
            {indicatorVisible ?
              <View style={styles.indicator}>
                <ActivityIndicator size={"large"} color={colorSchema.pink} />
              </View> : null}

            {states.map((v, i) => {
              if ((v.pl == "Password" && v.st.length < 8) || (v.pl == "Username" && v.st.length < 8) || (v.st.length < 5)) {
                if (emptyFields.includes(v.pl)) {
                } else {
                  setEmptyFields(flds => [...flds, v.pl])
                }
              } else {
                const index = emptyFields.indexOf(v.pl)
                if (index > -1) {
                  emptyFields.splice(index, 1)
                }
              }
              return (
                <View key={v.pl} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: colorSchema.padding, marginBottom: 10 }}>

                  <TextInput placeholder={v.pl} style={styles.textinp} onChangeText={v.setter} />
                  {((v.pl == "Password" && v.st.length < 8) || (v.pl == 'Username' && v.st.length < 8) || (v.st.length < 5)) ?

                    <View style={styles.ball}></View> : <View style={[styles.ball, { backgroundColor: colorSchema.white }]}></View>
                  }
                </View>
              )

            })

            }
            <Picker
              selectedValue={location}
              style={{ marginHorizontal: 13, height: 50, width: 150, borderRadius: 10, borderWidth: 1, borderColor: colorSchema.pink, }}
              onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
            >
              {locations.map((val, i) => {

                return <Picker.Item key={val.id} label={val.name} value={val.name} />

              })}

            </Picker>




            <View style={styles.FG}>
              {emptyFields.length < 1 ?
                <TouchableOpacity style={[styles.continue, { marginTop: 10 }]} onPress={async () => { await Registerapi() }} >

                  <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                  >Create Account</Text>
                </TouchableOpacity> : null}

              <TouchableOpacity style={[styles.continue2, { marginTop: 30 }]}

                onPress={() => {
                  navigation.push('Login', {})
                }} >

                <Text
                  style={
                    [commonstyles.txt, { fontSize: 16, fontFamily: 'reg' }]
                  }> Already have an account? <Text style={[commonstyles.txt, { color: colorSchema.pink, fontSize: 16, fontFamily: 'reg' }]}> Login</Text>
                </Text>

              </TouchableOpacity>



            </View>

          </View>
        </ScrollView>


      </View>
    </TouchableWithoutFeedback>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight + 5,
    alignItems: 'center'


  },
  arrow: {
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  arrowbutton: {
    width: 80,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#ff7f50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'red',
    elevation: 5,

  },
  vhead: {
    paddingHorizontal: 21,
    marginVertical: 40,
    justifyContent: "center",
    alignItems: "center"

  },
  vtext: {
    fontWeight: 'bold',
    fontSize: 25,

  },
  vinput: {
    alignItems: 'center',
    paddingHorizontal: colorSchema.padding
  },
  textinp: {
    width: 310,
    height: 56,
    backgroundColor: '#fff',
    paddingVertical: 9,
    paddingHorizontal: 9,
    borderRadius: 15,
    elevation: 1,
    marginTop: 5,
    borderColor: colorSchema.pink,
    borderWidth: 0.5,
    marginBottom: 12,
    fontFamily: 'reg'
  },
  continue2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorSchema.white,
    marginTop: 10,


  },
  continue: {
    width: 320,
    height: 50,
    backgroundColor: colorSchema.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },

  btn: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff'
  },

  FG: {
    
  },
  auth: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 45,
    elevation: 5
  },
  tauth: {
    fontWeight: 'bold',
    color: '#fff'

  },

  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  modalcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'


  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 200,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#ff7f50',
    padding: 15,
    marginTop: 8,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
  },
  ball: {
    width: 10,
    height: 10,
    backgroundColor: colorSchema.pink,
    borderRadius: 8,
    marginLeft: 10
  }

});
