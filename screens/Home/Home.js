import React, { useCallback, useEffect, useState } from 'react';
//importing dummy data for categories
import customdata from './data.json'
import { FontAwesome,Ionicons,EvilIcons,Feather } from '@expo/vector-icons';
import { StyleSheet, View,Text,SafeAreaView, StatusBar,TouchableOpacity, Animated,ScrollView,Image, TextInput, FlatList, } from 'react-native';

import {colorSchema,styles as commonstyles} from '../../setup';
import { hideAsync } from 'expo-splash-screen';
import Message from '../../components/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {
  let counter=0
  const[query,setquery]=useState("")
  const[messages,setmessages]=useState([])
  const[categories,setCategories]=useState([])
  const[popularItems,setPopularItems]=useState([])
  
  
  async function checktoken(){
    let name=await AsyncStorage.getItem('token')
    console.log(name)
  }
  useEffect(()=>{
    //saving categories to state
    
    setCategories(customdata.categories)
    setPopularItems(customdata.food)
  },[])

  function addMessage(message){
    console.log("adding function")
    setmessages(messages=>[...messages,message])
    console.log(messages)
  }

  return (
    <View style={styles.root} onLayout={async()=>{ await hideAsync()}}>
          
          
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
          
          
          <View style={[commonstyles.header,{marginTop:0}]}>
            <Text style={commonstyles.txt}>Home</Text>
            <View style={commonstyles.subHeader}>
             <TouchableOpacity style={{marginTop:3,marginRight:33}}> 
              <FontAwesome name="heart-o" size={22} color={colorSchema.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={async()=>{
              await checktoken()
            }}>
              <Ionicons name="cart-outline" size={26} color={colorSchema.black} />

            </TouchableOpacity>
            </View>
          </View>
          
          
          <ScrollView>
          <View style={{marginTop:15}}>
            <ScrollView  horizontal={true} style={{paddingLeft:colorSchema.padding}} showsHorizontalScrollIndicator={false} >
                <Image style={styles.banner}  fadeDuration={400} source={require('../../assets/foodbg2.jpg')}></Image>
                <Image style={[styles.banner,{marginLeft:16}]} fadeDuration={400} source={require('../../assets/foodbg1.jpg')}></Image>
            </ScrollView>
          </View>
          <View style={{paddingHorizontal:colorSchema.padding}}>
            
            <TextInput placeholderTextColor={colorSchema.black}  style={styles.search} placeholder={"Search Product..."} onChangeText={(txt)=>{console.log(categories)}}>

            </TextInput>
          </View>

                    
          <View style={[styles.Sections,{paddingLeft:0}]}>
            <Text style={[commonstyles.txt,{fontSize:20,paddingLeft:colorSchema.padding}]}>All Products</Text>
            <FlatList 
             data={categories}
             contentContainerStyle={{marginLeft:21,marginTop:14}}
             showsHorizontalScrollIndicator={false}
             horizontal={true}
             renderItem={({item})=>{
              return(<View style={{marginRight:20,justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity style={{marginBottom:5,width:60,height:60,borderWidth:1,borderRadius:325,borderColor:colorSchema.black}}>
                    <Image style={styles.catImages}  fadeDuration={400} source={require('../../assets/p1.jpg')}/>
                  </TouchableOpacity>
                  <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:13}]}>
                    {item.title}
                  </Text> 
                </View>)
             }}
            />
          </View>



          <View style={[styles.Sections,{paddingLeft:0}]}>
            <View style={[styles.Sections,{paddingHorizontal:18,marginTop:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
              <Text style={[commonstyles.txt,{fontSize:20}]}>Popular Items</Text>
              <Text  style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.grey}]}>See All </Text>
            </View>
            <FlatList 
             data={popularItems}
             contentContainerStyle={{marginLeft:21,marginTop:15}}
             showsHorizontalScrollIndicator={false}
             horizontal={true}
             renderItem={({item})=>{
              return(<View style={{alignItems:'center',marginRight:10}}>
                  <TouchableOpacity onPress={()=>{navigation.push('FoodDetail',{item})}}>
                    
                  <Image style={styles.foodImages} source={require('../../assets/pepper.jpg')}/>
                  </TouchableOpacity>
                  <View style={{alignItems:'center'}}>
                    <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:19}]}>{item.title}</Text>
                    <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.grey}]}>₦{item.price}.00</Text>
                    <TouchableOpacity style={{width:87,height:27,backgroundColor:colorSchema.pink,alignItems:'center',justifyContent:'center',borderRadius:11}}>
                      <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.white}]}>Add cart</Text>
                      </TouchableOpacity>
                  </View>
              </View>)
             }}
             />
          </View>


          <View style={[styles.Sections,{paddingLeft:0}]}>
    
            <View style={[styles.Sections,{paddingHorizontal:18,marginTop:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
              <Text style={[commonstyles.txt,{fontSize:20}]}>New Items</Text>
              <Text  style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.grey}]}>See All </Text>
            </View>
            <FlatList 
             data={popularItems}
             contentContainerStyle={{marginLeft:21,marginTop:14}}
             showsHorizontalScrollIndicator={false}
             horizontal={true}
             renderItem={({item})=>{
              return(<View style={{alignItems:'center',marginRight:10}}>
                <TouchableOpacity onPress={()=>{navigation.push('FoodDetail',{item})}}>
                    
                    <Image style={styles.foodImages} source={require('../../assets/cake.jpg')}/>
                    </TouchableOpacity>
                  <View style={{alignItems:'center'}}>
                    <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:19}]}>{item.title}</Text>
                    <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.grey}]}>₦{item.price}.00</Text>
                    <TouchableOpacity 
                    onPress={()=>{addMessage("added")}}
                    style={{width:87,height:27,backgroundColor:colorSchema.pink,alignItems:'center',justifyContent:'center',borderRadius:11}}>
                      <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.white}]}>Add cart</Text>
                      </TouchableOpacity>
                  </View>
              </View>)
             }}
             />
          </View>
          
          <></>
          <View style={{justifyContent:'center',alignItems:'center',marginTop:18}}>
            <TouchableOpacity style={styles.searchBtn} onPress={()=>navigation.push('MoreInfo')}>
              <Feather name="more-horizontal" size={22} color={colorSchema.white} />
            </TouchableOpacity>

          </View>
          </ScrollView>
    </View>
      
   
  );
  
}
const styles=StyleSheet.create({
  root:{
    flex:1,
    
    paddingTop:StatusBar.currentHeight+10,
    backgroundColor:colorSchema.white
  },
  banner:{
    width:235,
    height:111,
    borderRadius:11,
    resizeMode:'cover'
  },
  Sections:{
    marginTop:15,
    paddingLeft:21,
  },
  foodImages:{
    width:162,
    height:169,
    borderRadius:10,
    resizeMode:'center'
  },
  catImages:{
    width:60,
    height:60,
    borderRadius:30,
  },
  search:{
    width:334,
    height:40,
    paddingLeft:9,
    fontFamily:'reg',
    fontSize:16,
    backgroundColor:colorSchema.grey,
    marginTop:15,
    borderRadius:11
    
  },
  searchSection:{
    borderRadius:11,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:15,
    paddingLeft:colorSchema.padding,
    backgroundColor:'#B0B0B0',
    
  },searchBtn:{
    height:60,
      width:60,
      borderRadius:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:colorSchema.pink
    }
  
  




})
