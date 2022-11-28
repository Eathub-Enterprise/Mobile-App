import React, { useCallback, useEffect, useState } from 'react';
//importing dummy data for categories
import customdata from './data.json'
import { FontAwesome,Ionicons,EvilIcons,MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View,Text,ImageBackground,TouchableOpacity,StatusBar} from 'react-native';
import {colorSchema,styles as commonstyles} from '../../setup';
import { hideAsync } from 'expo-splash-screen';


export default function FoodDetailScreen({route,navigation}) {
  const[query,setquery]=useState("")
  const [rating,setRating]=useState(null)
  const[categories,setCategories]=useState([])
  const[popularItems,setPopularItems]=useState([])
  
  useEffect(()=>{
    //saving categories to state
    setCategories(customdata.categories)
    setPopularItems(customdata.food)
  },[])
  return (
    <View style={styles.root} >
      {//FOOD PIC BG
      }
      <ImageBackground 
      source={require('../../assets/foodbg1.jpg')} 
      imageStyle={{borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        resizeMode:'cover',}}
      style={[{flex:1.1}]}>
        
    
      <View style={[commonstyles.header,{marginTop:0,paddingTop:StatusBar.currentHeight}]}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <MaterialIcons name="arrow-back" size={24} color={colorSchema.black} />
        </TouchableOpacity>
        <View style={commonstyles.subHeader}>
             <TouchableOpacity style={{marginTop:3,marginRight:13}}> 
              <FontAwesome name="heart-o" size={22} color={"black"}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{console.log(route.params)}}>
              <Ionicons name="cart-outline" size={26} color={"black"} />

            </TouchableOpacity>
            </View>

      </View>
    </ImageBackground>
    {//END OF FOOD BG
      }
    <View style={{flex:2,paddingHorizontal:21}}>
      <View style={[commonstyles.header,{paddingHorizontal:0}]}>
          <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:20}]}>{route.params.item.title}</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
          <Ionicons name="md-location-outline" size={19} color={colorSchema.grey} />
          <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.grey}]}>{route.params.item.location} Km away</Text>
        </View>
        <View style={{}}>
       
          <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.pink}]}>₦{route.params.item.price}.00 </Text>
          <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.grey}]}>Free sheeping</Text>
        </View>
        
      </View>
      <View style={{marginTop:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View>
            <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.lightgray}]}>4.5 rating</Text>
            <View style={{marginTop:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              {[1,2,3,4,5].map((v,i)=>{
                   if(v<=route.params.item.rating){
                  return(
                    <View style={{marginRight:9}}>
                      <FontAwesome name="star" size={19} color={colorSchema.pink} />

                    </View>
                )
                  }else{
                    return(
                    <FontAwesome name="star-o" size={19} color={colorSchema.pink} />
              )}

                 
              })}
            </View>
            

          </View>
          {//RATING OF FOOD SYSTEM
}
          <View>
            <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:16,color:colorSchema.lightgray}]}>Give your rating</Text>
            <View style={{marginTop:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              {[1,2,3,4,5].map((v,i)=>{
                    console.log(v)
                   if(v<=rating){
                    console.log('yes')
                  return(<TouchableOpacity onPress={()=>{setRating(v)}}>

                    <FontAwesome name="star" size={19} color={colorSchema.pink} />
                </TouchableOpacity>)
                  }else{
                    return(
                    <TouchableOpacity onPress={()=>{setRating(v)}}>

                    <FontAwesome name="star-o" size={19} color={colorSchema.pink} />
                </TouchableOpacity>)
                  }

                 
              })}
            </View>
            
          </View>

        </View>
      <View style={[commonstyles.header,{paddingHorizontal:0}]}>
          <Text style={[commonstyles.txt,{fontFamily:'reg',fontSize:20}]}>DETAILS</Text>
      </View>

    </View>
    
        
    </View>
    
      
   
  );
  
}
const styles=StyleSheet.create({
  root:{
    flex:1,
    
  }


})
