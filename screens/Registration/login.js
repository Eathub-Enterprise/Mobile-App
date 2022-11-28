import React, {useState,useEffect,useRef} from 'react';
import { View,Text,StyleSheet,StatusBar ,TouchableOpacity, TextInput,TouchableWithoutFeedback,Modal,Keyboard,ActivityIndicator,ScrollView,Platform} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema,styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';

//add message toast to display messages
export default  function Loginscreen(props){

    const [username,setusername]=useState('')
    const[visible,setvisible]=useState(false)
    const[indicatorVisible,setIndicatorVisible]=useState(false)
    const [password,setpassword]=useState('')
    const [messages,setmessages]=useState([])
    const [message,setmessage]=useState('')

    let counter=0

    function err(err){
        console.log(err)
    }

    function addMessage(message){
        console.log("adding function")
        setmessages(messages=>[...messages,message])
        console.log(messages)
      }
    
  
    useEffect(()=>{
        if('username' in props.route.params){
        addMessage(`${props.route.params.username} created`)

        }
    },[])
    
  
    
    function save(value) {
      securestore.setItemAsync('details', value).then(response=>{console.log("wait o");props.navigation.replace('main')} );
    }
  
 

    //conneting to my api
    async function loginapi(){
        setIndicatorVisible(true)
        console.log({username,password})
        const requestOptions={
            method:'Post',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username,password})
          }
        try{
        let response=await fetch('https://eathub-web-api.herokuapp.com/api/v1/token/login/',requestOptions)
        let result=await response.json()
        console.log(result)
        if("non_field_errors" in result){
            addMessage("Incorrect details")
            setIndicatorVisible(false)
        }else if("auth_token" in result){
            addMessage("Logging you in boss")
            await AsyncStorage.setItem('token',result.auth_token,err)
            if('username' in props.route.params){
            await AsyncStorage.setItem('username',props.route.params.username,err)
            setIndicatorVisible(false)

            }
            (setTimeout(()=>{
                props.navigation.replace('HomeStack')
            },900))   
        }
        }catch(err){
            console.log(err)
            addMessage("Check Internet connection")
            setIndicatorVisible(false)
        }
        

    }
    
    //for skipping to homepage when logged in 

    return(
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        
        <View style={styles.container} onLayout={async()=>{ await hideAsync()}}>
        <View style={{position:'absolute',top:25,left:0,right:0,paddingHorizontal:20}}>
          {messages.map(m =>{
            return(
              <Message
              //sending a message 
                key={counter+1} 
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
        
        <ScrollView>
        
            <View style={styles.vhead}>
                <Text style={[commonstyles.txt,{fontSize:24}]}>Log into</Text>
                <Text style={[commonstyles.txt,{fontSize:24}]}>your account</Text>

            </View>
            
            <View style={styles.vinput}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                <TextInput placeholder={'username'} style={styles.textinp} onChangeText={setusername}/>
                {username.length<5?
                        <View style={styles.ball}></View>:<View style={[styles.ball,{backgroundColor:colorSchema.white}]}></View>
                    }
                </View>
          
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    
                    <TextInput placeholder={'Password'} secureTextEntry={true} style={styles.textinp} onChangeText={setpassword}/>
                    {password.length<5?
                        <View style={styles.ball}></View>:<View style={[styles.ball,{backgroundColor:colorSchema.white}]}></View>
                    }
                </View>
                {(username.length<5 || password.length<5)?
                null:
                <TouchableOpacity style={styles.continue} onPress={async()=>{await loginapi()}} >
                  
                  <Text style={[commonstyles.txt,{color:colorSchema.white,fontSize:16,fontFamily:'reg'}]} 
                  >Login</Text>
                </TouchableOpacity>}
                 
                { indicatorVisible ?
                <View style={styles.indicator}>
                  <ActivityIndicator size={"large"} color={colorSchema.pink}/>
                </View> :null}
                <View style={styles.FG}>
                
                
                
                

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
      paddingTop:StatusBar.currentHeight+20,
  
  
    },
    arrow:{
      paddingHorizontal:30,
      paddingVertical:5,
    },
    arrowbutton:{
      width:80,
      paddingHorizontal:20,
      paddingVertical:13,
      borderRadius:10,
      backgroundColor:'#ff7f50',
      justifyContent:'center',
      alignItems:'center',
      shadowColor:'red',
      elevation:5,
  
    },
    vhead:{
      paddingHorizontal:21,
      paddingVertical:30,
      marginTop:65,
      marginBottom:20
  
    },
    vtext:{
      fontWeight:'bold',
      fontSize:25,
  
    },
    vinput:{
    alignItems:'center',
    paddingHorizontal:colorSchema.padding
    },
    textinp:{
      width:250,
      backgroundColor:'#fff',
      paddingVertical:9,
      paddingHorizontal:9,
      borderRadius:15,
      elevation:1,
      marginTop:12,
      borderColor:colorSchema.pink,
      borderWidth:0.5,
      marginBottom:12,
      fontFamily:'reg'
    },
    continue:{
      width:150,
      paddingHorizontal:20,
      paddingVertical:16,
      backgroundColor:colorSchema.pink,
      marginTop:35,
      alignItems:'center',
      elevation:2,
      borderRadius:100
    },
    btn:{
      fontWeight:'bold',
      fontSize:15,
      color:'#fff'
    },
  
    FG:{
      flexDirection:'row',
      justifyContent:'space-around',
      padding:7,
    },
    auth:{
      width:45,
      height:45,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#fff',
      margin:20,
      borderRadius:45,
      elevation:5
    },
    tauth:{
      fontWeight:'bold',
      color:'#fff'
  
    },
    
    indicator:{
      alignItems:'center',
      justifyContent:'center',
      marginTop:10
    },
    modalcontainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'


    },

    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      width:200,
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
        backgroundColor:'#ff7f50',        
        padding: 19,
        marginTop:8,
        elevation: 2,
      },
      textStyle: {
          color: 'white',
          fontWeight: 'bold',
      },
      modalText: {
          marginBottom: 15,
      },
    ball:{
        width:10,
        height:10,
        backgroundColor:colorSchema.pink,
        borderRadius:8,
        marginLeft:10
    }
  
  });
  