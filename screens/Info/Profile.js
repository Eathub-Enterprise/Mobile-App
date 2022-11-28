import React, {useState,useEffect,useRef} from 'react';
import { View,Text,StyleSheet,StatusBar ,TouchableOpacity, TextInput,TouchableWithoutFeedback,Modal,Keyboard,ActivityIndicator,ScrollView,Platform} from 'react-native';
import { FontAwesome5,MaterialIcons,Ionicons,Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema,styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';

//add message toast to display messages
export default  function Profilescreen(props){

   const[edit,setEdit]=useState(false)
    const [messages,setmessages]=useState([])
    let pages=[
        {icon:'dollar-sign',name:"Username",value:"Tylerthecreator1"},
        {icon:'shopping-bag',name:"Email",value:"cc@gmailcom"},
        {icon:'First ',name:"Phone number",value:"08058876058"},
        {icon:'eye-off',name:"First name",value:"Erioluwa"},
        {icon:'info',name:"Middle Name",value:"Samuel"},
        {icon:"log-out",name:"Last Name",value:"Abiodun"},
    ]
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
        //if('username' in props.route.params){
        //addMessage(`${props.route.params.username} created`)
        let a=2
        //}
    },[])
    
    
    
   
 

   
    
    //for skipping to homepage when logged in 

    return(
        <View style={styles.container}>
            <View style={[styles.header,{paddingHorizontal:colorSchema.padding}]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={()=>{props.navigation.goBack()}}>
                        <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt,{fontSize:22,marginLeft:32,marginTop:5}]}>Profile</Text>
                    
                </View>
                <TouchableOpacity>

                    </TouchableOpacity>

            </View>
            <View style={{height:80,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{
                    if(edit){
                        setEdit(false)
                    
                    }else{
                        setEdit(true)
                    }
                }}style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Feather name="edit" size={15} color={colorSchema.pink} />
                    <Text style={[commonstyles.txt,{fontSize:11,marginLeft:4,fontFamily:'reg',color:colorSchema.pink,borderBottomWidth:1,borderBottomColor:colorSchema.pink}]}>Edit profile</Text>
                </TouchableOpacity>
                
                <Text style={[commonstyles.txt,{fontSize:20}]}>Hi Tyler</Text>
            </View>
            {
                pages.map((v,i)=>{
                    return(
                        <View key={i} style={{height:56,borderRadius:20,marginBottom:10,justifyContent:'center',paddingHorizontal:colorSchema.padding}}>
                        <Text style={[commonstyles.txt,{fontSize:10,fontFamily:'reg',marginLeft:16,color:'#4A4B4D'}]}>{v.name}</Text>        
                        <TextInput placeholderTextColor={colorSchema.black}  style={{fontFamily:'reg',fontSize:16,marginLeft:20,color:'#4A4B4D'}} placeholder={v.value}></TextInput>
                            
                        </View>
                    )
                })
            }
            <View style={{justifyContent:'center',alignItems:'center'}}>

           {edit? <TouchableOpacity style={styles.continue} onPress={async()=>{console.log("jsnf")}} >
                  
                  <Text style={[commonstyles.txt,{color:colorSchema.white,fontSize:16,fontFamily:'reg'}]} 
                  >Save</Text>
            </TouchableOpacity>: null}
            </View>


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
    continue:{
        width:130,
        paddingHorizontal:20,
        paddingVertical:16,
        backgroundColor:colorSchema.pink,
        marginTop:35,
        alignItems:'center',
        elevation:2,
        borderRadius:100
      },
    
  });
  