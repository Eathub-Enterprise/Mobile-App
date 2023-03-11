import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, MaterialIcons, Foundation, Ionicons, Feather } from '@expo/vector-icons';
import { MoreStack } from './MoreStack';
import { HomeStack } from './homeStack';
import { colorSchema, } from '../setup';
import Profilescreen from '../screens/Info/Profile';
import OrderTrackerScreen from '../screens/Checkout/OrderTracker';
import Endpoints from '../backend';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const backendConnector = new Endpoints()

function useNotificationsBadge() {
    const [hasNotifications, setHasNotifications] = useState(null);
    const [food, setFood] = useState([])
    const [currentItem, setcurrentItem] = useState({})
    const [isrefreshing, setrefresh] = useState(false)
    const [messages, setmessages] = useState([])
    const [currentPage, setcurrentPage] = useState(1)
    const [Header, setHeader] = useState("Track your orders")
    //const userId = Firebase.auth().currentUser.uid;
    useEffect(
        () => {
            async function SetScreen() {
                await backendConnector.NavBarTrackOrder("Get", setHasNotifications
                )
            }
            SetScreen()

        },
        []
    );
    console.log(`show badge ${hasNotifications}`)
    return hasNotifications

}
export default function TabNav() {
    const [hasNotifications, setHasNotifications] = useState(null);
    let ans = 0
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colorSchema.pink,
                tabBarLabelStyle: { fontFamily: 'reg' },

            }}
            screenListeners={({ navigation }) => ({
                state: (e) => {
                    
                    backendConnector.NavBarTrackOrder("Get", setHasNotifications).then(() => { console.log("") })
                    // Do something with the state
                    console.log(hasNotifications)
                        
                    // Do something with the `navigation` object
                },
            })}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrderTrackerScreen}
                options={{
                    tabBarBadge: hasNotifications,

                    headerShown: false,
                    tabBarLabel: 'Orders',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="shopping-bag" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profilescreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="More"
                component={MoreStack}
                options={{
                    headerShown: false,
                    tabBarLabel: 'More',
                    tabBarIcon: ({ color, size }) => (
                        <Foundation name="indent-more" size={size} color={color} />
                    ),
                }}
            />


        </Tab.Navigator>
    )
}