import React, {useState,useEffect,useRef} from 'react';
import { View,Text,StyleSheet,StatusBar ,TouchableOpacity,ImageBackground,ActivityIndicator,Switch,ScrollView,Platform, FlatList} from 'react-native';
import { FontAwesome5,MaterialIcons,Ionicons,Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema,styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoints from '../../backend';
import LottieView from 'lottie-react-native';

//this is basically just a list of vendors

//i have not tested the loadMore functionality
let IMAGEBG_LOCATIONS=[require('../../assets/bg1.jpg'),
require('../../assets/bg2.jpg'),
require('../../assets/bg3.jpg'),
require('../../assets/bg4.jpg'),
require('../../assets/bg5.jpg'),
require('../../assets/bg6.jpg'),
require('../../assets/bg7.jpg'),
require('../../assets/bg8.jpg'),
require('../../assets/bg9.jpg'),

]
export default  function ListOfVendorsScreen(props){
    const[vendors,setVendors]=useState([])
    const[currentPage,setcurrentPage]=useState(1)
    const[isrefreshing,setrefresh]=useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [location, setLocation] = useState("same")

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
        if (location == "same") {
            setLocation("all")
        } else {
            setLocation("same")
        }
        addMessage("Refresh page")

    }
    let backendConnector = new Endpoints()
 
    function addMessage(message){
        console.log("adding function")
        setmessages(messages=>[...messages,message])
        console.log(messages)
      }
    
    useEffect(()=>{
       async function SetScreen(){
            
            await backendConnector.ListOfVendors(setVendors,addMessage,2,currentPage,setcurrentPage,vendors,setrefresh,location)
      }
      SetScreen()
    },[])
    

    const [messages,setmessages]=useState([])
    
    

    function genImageBackground(){
        //for radomizing the background of the images
        let randomIndex=Math.floor(Math.random() * 9)
        return IMAGEBG_LOCATIONS[randomIndex]
    }

    async function LoadMore(){
        if (currentPage===0) {
            addMessage("No more results")
        }else{
            
            await backendConnector.ListOfVendors(setVendors,addMessage,2,currentPage,setcurrentPage,vendors,setrefresh,location)
        }
          
    }
    
  
    useEffect(()=>{
        //if('username' in props.route.params){
        //addMessage(`${props.route.params.username} created`)
        let a=2
        //}
    },[])
    
    
    
   
 

   
    
    //for skipping to homepage when logged in 

    return(
        <View style={styles.container}>
            <View style={{position:'absolute',top:25,left:0,right:0,paddingHorizontal:20}}>
                {messages.map(m =>{
                    return(
                    <Message
                    //sending a message 
                        key={Math.floor(Math.random() * 20)} 
                        message={m}
                        onHide={()=>{
                        setmessages((messages)=>messages.filter((currentMessage)=>{
                            currentMessage!==m

                            }
                        ))
                        }}
                    />

                    )
                })}
             </View> 
            <View style={[styles.header,{paddingHorizontal:colorSchema.padding}]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={()=>{props.navigation.goBack()}}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt,{fontSize:22,marginLeft:32,marginTop:5}]}>View vendors </Text>
                    
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#f4f3f4" }}
                        thumbColor={isEnabled ? colorSchema.pink : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <TouchableOpacity onPress={() =>
                        console.log(location)
                        //    props.navigation.push("Cart")
                    } >

                        <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height:30}}></View>
            
            <FlatList
                onRefresh={async()=>{
                    setVendors([])
                    setcurrentPage((cp)=> 1)
                    await backendConnector.ListOfVendors(setVendors,addMessage,2,1,setcurrentPage,vendors,setrefresh,location)
                }
                }
                refreshing={isrefreshing}
                onEndReached={async()=> await LoadMore()}
                onEndReachedThreshold={0}
                data={vendors}
                contentContainerStyle={{paddingHorizontal:40,alignContent:'center',justifyContent:'center'}}
                renderItem={({item})=>{
                    return(
                        <TouchableOpacity onPress={()=>{props.navigation.push("FoodItemsofVendor",{vendor:item})}}>
                            <ImageBackground source={genImageBackground()} resizeMode="cover" style={styles.bgImage} imageStyle={{borderRadius:10}} >
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                    <Text style={[commonstyles.txt,{color:colorSchema.white}]}>{item.vendorname}</Text>
                                    <Text style={[commonstyles.txt,{color:colorSchema.white,fontSize:17}]}>{item.location} <Ionicons name="location-sharp" size={13} color={colorSchema.white} /></Text>
                                    <Text style={[commonstyles.txt,{color:colorSchema.white,fontSize:15}]}>rating: {item.total_rating}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        
                    )

                }}
            
            />

        </View>

    )

} 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:StatusBar.currentHeight+10,
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    bgImage:{
        height:210,
        marginVertical:10,
        alignItems:'center',
        justifyContent:'center'
    }
    
  });
  