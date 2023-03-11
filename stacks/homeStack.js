import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Cartscreen from '../screens/Checkout/Cart';
import OrderTrackerScreen from '../screens/Checkout/OrderTracker';
import PaymentScreen from '../screens/Checkout/Payment';
import FavouriteMealsScreen from '../screens/Home/Favourite';
import FoodByCategoryScreen from '../screens/Home/foodByCatogory';
import FoodDetailScreen from '../screens/Home/foodDetail';
import HomeScreen from '../screens/Home/Home';
import SearchScreen from '../screens/Home/Search';
import FoodItemsofVendorScreen from '../screens/Info/FoodItemsOfVendor';
import ListOfVendorsScreen from '../screens/Info/ListofVendors';
import MoreInfoscreen from '../screens/Info/More';
import Profilescreen from '../screens/Info/Profile';

const Stack = createNativeStackNavigator();

export function HomeStack(){
    return(
        <Stack.Navigator>
         <Stack.Screen options={{headerShown:false}} name='Home' component={HomeScreen}/> 
         <Stack.Screen options={{headerShown:false}} name='FoodDetail' component={FoodDetailScreen}/>
         <Stack.Screen options={{headerShown:false}} name='Favourite' component={FavouriteMealsScreen}/>
         <Stack.Screen options={{headerShown:false}} name='Cart' component={Cartscreen}/>
         <Stack.Screen options={{headerShown:false}} name='FoodByCategory' component={FoodByCategoryScreen}/>
         <Stack.Screen options={{headerShown:false}} name='Search' component={SearchScreen}/>
        </Stack.Navigator>
    )

}