import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FoodDetailScreen from '../screens/Home/foodDetail';
import HomeScreen from '../screens/Home/Home';
import MoreInfoscreen from '../screens/Info/More';
import Profilescreen from '../screens/Info/Profile';

const Stack = createNativeStackNavigator();

export default function HomeStack(){
    return(
        <Stack.Navigator>
         <Stack.Screen options={{headerShown:false}} name='Home' component={HomeScreen}/> 
         <Stack.Screen options={{headerShown:false}} name='FoodDetail' component={FoodDetailScreen}/>
         <Stack.Screen options={{headerShown:false}} name='MoreInfo' component={MoreInfoscreen}/>
         <Stack.Screen options={{headerShown:false}} name='Profile' component={Profilescreen}/>
        </Stack.Navigator>
    )

}