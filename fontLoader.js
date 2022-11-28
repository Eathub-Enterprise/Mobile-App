import * as Font from 'expo-font';

const custom_fonts={
    'bold':require('./assets/fonts/Poppins-Bold.ttf'),
    'reg':require('./assets/fonts/Poppins-Regular.ttf'),
  }
export default async function _loadMyFonts(){
    await Font.loadAsync(custom_fonts);

    console.log("Loaded")
  }