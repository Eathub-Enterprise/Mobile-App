import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoints from '../../backend';
import { Picker } from '@react-native-picker/picker';

//add message toast to display messages

const locations = [{ id: 1, name: "Lekki" }, { id: 2, name: "Ikeja" }, { id: 3, name: "Agege" }]

export default function Profilescreen(props) {
    const backendConnector = new Endpoints()
    const [edit, setEdit] = useState(false)
    const [username, setusername] = useState('')
    const [refreshing, setRefreshing] = React.useState(false);

    const [address, setAddress] = useState('')
    const [email, setemail] = useState('')
    const [phonenumber, setphonenumber] = useState('')
    const [firstname, setfirstname] = useState('')
    const [userProfile, setUserProfile] = useState({})
    const [location, setLocation] = useState("")

    const [messages, setmessages] = useState([])

    function mainFunc() {
        let l_email = email
        let l_phonenumber = phonenumber
        let l_firstname = firstname
        let l_address = address
        let pages = [
            { icon: 'shopping-bag', name: "Email", value: userProfile.email, stFunc: setemail },
            { icon: 'First ', name: "Phone number", value: userProfile.phonenumber, stFunc: setphonenumber },
            { icon: 'eye-off', name: "First name", value: userProfile.firstname, stFunc: setfirstname },
            { icon: 'eye-off', name: "Address", value: userProfile.address, stFunc: setAddress },
        ]
        return pages;
    }

    let counter = 0

    function err(err) {
        console.log(err)
    }

    function addMessage(message) {
        console.log("adding function")
        setmessages([message])
        console.log(messages)
    }


    useEffect(() => {
        console.log(process.env.PORT)
        async function SetScreen() {

            await backendConnector.profile(setUserProfile, "Get", addMessage)


        }


        SetScreen()
        
    }, [])

    useEffect(() => {



        setAddress(userProfile.address)
        setusername(userProfile.username)
        setfirstname(userProfile.firstname)
        setphonenumber(userProfile.phonenumber)
        setemail(userProfile.email)
        setLocation(userProfile.location)

    }, [userProfile])

    const onRefresh = async function () {
        setRefreshing(true);
        await backendConnector.profile(setUserProfile, "Get", addMessage)

        setRefreshing(false)
    }





    //for skipping to homepage when logged in 

    return (
        <View style={styles.container}>
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

            <View style={[styles.header, { paddingHorizontal: 20 }]}>
                <View style={[]}>

                    <Text style={[commonstyles.txt, { fontFamily: 'reg', fontSize: 22, marginTop: 5 }]}>Profile</Text>

                </View>
                <TouchableOpacity>

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
            >
                <View style={{ height: 80, justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                    <TouchableOpacity onPress={() => {
                        if (edit) {
                            setEdit(false)

                        } else {
                            setEdit(true)
                        }
                    }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Feather name="edit" size={15} color={colorSchema.pink} />
                        <Text style={[commonstyles.txt, { fontSize: 11, marginLeft: 4, fontFamily: 'reg', color: colorSchema.pink, borderBottomWidth: 1, borderBottomColor: colorSchema.pink }]}>Edit profile</Text>
                    </TouchableOpacity>

                    <Text style={[commonstyles.txt, { fontSize: 20, marginTop: 12 }]}>Hi there {userProfile.username}</Text>
                </View>
                <View style={{ marginBottom: 10, justifyContent: 'center', alignItems: "center", paddingHorizontal: colorSchema.padding, marginTop: 46 }}>

                    {
                        mainFunc().map((v, i) => {
                            return (
                                <View key={i} style={{}}>
                                    <TextInput placeholderTextColor={colorSchema.black} style={styles.textinp} placeholder={v.value} onChange={(event) => {
                                        v.stFunc(event.nativeEvent.text)
                                    }
                                    }></TextInput>

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
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                    {edit ? <TouchableOpacity style={styles.continue} onPress={async () => {
                        console.log("jsnf")
                        if (Object.keys(userProfile).length > 1) {
                            addMessage("Updating your profile")
                            await backendConnector.profile(setUserProfile, "Put", addMessage, { username, address, email, phonenumber, firstname,location }, setEdit)
                        }
                        console.log(Object.keys(userProfile).length)
                    }}
                    >

                        <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                        >Save</Text>
                    </TouchableOpacity> : null}
                </View>

            </ScrollView>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    continue: {
        width: 336,
        height: 56,
        backgroundColor: colorSchema.pink,
        marginTop: 35,
        justifyContent: "center",
        alignItems: 'center',
        elevation: 2,
        borderRadius: 100
    },
    textinp: {
        width: 333,
        height: 57,
        backgroundColor: '#F2F2F2',
        paddingVertical: 9,
        paddingHorizontal: 9,
        borderRadius: 15,
        elevation: 1,
        marginBottom: 20,
        fontFamily: 'reg'
    },
});
