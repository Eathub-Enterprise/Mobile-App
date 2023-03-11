import React, { useCallback, useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from './fontLoader';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Image, View, Platform, Alert, Text } from 'react-native';
import * as hs from './stacks/homeStack';
import RegistrationStack from './stacks/RegistrationStack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as  Linking from 'expo-linking';
import * as TabNavigator from './stacks/tabNavStack';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [badge_no, setBadgeNO] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [appIsReady, setAppIsReady] = useState(false);

  const handleURL = (url) => {
    const { hostname, path, queryParams } = Linking.parse(url);
    if (path === 'alert') {
      console.log(queryParams.str);
    } else {
      console.log(path, queryParams);
    }
  }
  const url = Linking.useURL();

  useEffect(() => {
    // Do something with url
    if (url) {
      handleURL(url);
    } else {
      console.log('No URL');
    }
  }, [url]);


  const Stack = createNativeStackNavigator()

  const config = {
    screens: {
      TabNav: {
        screens: {
          More: {
            screens: {
              FoodItemsofVendor: {
                path: 'deeplinking/:vendorname/:vendorid',
              },
            },
          }
           
         
        },
      },
    }
  }
  const linking = {
    prefixes: ['mychat://', 'https://emachine.pythonanywhere.com'],
    config
  };

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
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>} >
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='RegistrationStack' component={RegistrationStack} />
        <Stack.Screen options={{ headerShown: false }} name='TabNav' component={TabNavigator.default} />

      </Stack.Navigator>
    </NavigationContainer>

  );

}

