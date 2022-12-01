import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from './fontLoader';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Image, View, Platform } from 'react-native';
import HomeStack from './stacks/homeStack';
import RegistrationStack from './stacks/RegistrationStack';
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const Stack=createNativeStackNavigator()

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await _loadMyFonts();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        console.log('Loading app...')
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

 

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name='RegistrationStack' component={RegistrationStack} />
        <Stack.Screen options={{headerShown: false}} name='HomeStack' component={HomeStack} />
      </Stack.Navigator>
    </NavigationContainer>
   
  );
  
}

