import React ,{useRef, useState} from "react";
import { useEffect } from 'react';
import { View,Text,StyleSheet,StatusBar, Modal, TouchableOpacity, TextInput,SectionList,FlatList,ImageBackground, Animated} from 'react-native';
import LottieView from 'lottie-react-native';



const getRandomMessage=()=>{
    const number=Math.trunc(Math.random()* 1000);
    return 'Random message'+number;

}

const Message =(props)=>{
    const opacity=useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        Animated.sequence([
            Animated.timing(opacity,{
                toValue:1,
                duration:500,
                useNativeDriver:true
            }),
            Animated.delay(1600),
            Animated.timing(opacity,{
                toValue:0,
                duration:500,
                useNativeDriver:true
            }),
        ]).start(()=>props.onHide());

    },[])
    return(
        <Animated.View
            style={{
                opacity,
                transform:[
                    {
                        translateY:opacity.interpolate({
                            inputRange:[0,1],
                            outputRange:[-20,0],
                        })
                    }
                ],
                borderRadius:4,
                shadowColor:'transparent',
                height:50,
                elevation:1,
                alignItems:"center",
                justifyContent:'center',
                zIndex:5  
            }}
        >   
        <View style={{alignItems:'center',justifyContent:'center',paddingLeft:19}}>
            <LottieView source={require('../assets/check.json')}
            autoPlay={true}
            loop={true}
            style={{width:'12%',aspectRatio:1}}
        ></LottieView>
        </View>
        </Animated.View>

    )
}

export default Message;