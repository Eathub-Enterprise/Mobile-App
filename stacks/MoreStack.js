import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Cartscreen from '../screens/Checkout/Cart';
import OrderTrackerScreen from '../screens/Checkout/OrderTracker';
import PaymentScreen from '../screens/Checkout/Payment';
import FavouriteMealsScreen from '../screens/Home/Favourite';
import FoodByCategoryScreen from '../screens/Home/foodByCatogory';
import FoodDetailScreen from '../screens/Home/foodDetail';
import HomeScreen from '../screens/Home/Home';
import SearchScreen from '../screens/Home/Search';
import Aboutusscreen from '../screens/Info/Aboutus';
import FoodItemsofVendorScreen from '../screens/Info/FoodItemsOfVendor';
import ListOfVendorsScreen from '../screens/Info/ListofVendors';
import MoreInfoscreen from '../screens/Info/More';
import Profilescreen from '../screens/Info/Profile';

const Stack = createNativeStackNavigator();

export function MoreStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='MoreInfo' component={MoreInfoscreen} />
            <Stack.Screen options={{ headerShown: false }} name='OrderTracker' component={OrderTrackerScreen} />
            <Stack.Screen options={{ headerShown: false }} name='ListOfVendors' component={ListOfVendorsScreen} />
            <Stack.Screen options={{ headerShown: false }} name='FoodItemsofVendor' component={FoodItemsofVendorScreen} />
            <Stack.Screen options={{ headerShown: false }} name='Payment' component={PaymentScreen} />
            <Stack.Screen options={{ headerShown: false }} name='AboutUs' component={Aboutusscreen} />

        </Stack.Navigator>
    )

}