import { StyleSheet, View,Text,SafeAreaView, TouchableOpacity, Animated,ScrollView,Image, TextInput, FlatList} from 'react-native';


//These are the basic styles i repeat everywhere
let colorSchema={
    black:'#100F1F',
    pink:'#FF8323',
    grey:'#B0B0B0',
    lightgray:'#F6F6F6',
    verylightgray:"#F6F6F6",
    search:'#6C6C6C',
    white:'#FFFFFF',
    font:'poppins',
    padding:21
}
const styles=StyleSheet.create({
    root:{
      flex:1,
      
    },header:{
      marginTop:15,
      paddingHorizontal:colorSchema.padding,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      fontFamily:'bold'
    },subHeader:{
      flexDirection:'row',
      justifyContent:'space-between',
  
    }, txt:{
      fontFamily:'bold',
      fontSize:24,
      fontWeight:'500',
      color:colorSchema.black
    },
  
  
  })
  


export {colorSchema,styles}