import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Loginscreen from '../screens/Registration/login';
import Registrationscreen from '../screens/Registration/Registration';

const Stack = createNativeStackNavigator();

export default function RegistrationStack(){
    return(
        <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name='Registration' component={Registrationscreen}/> 
         <Stack.Screen options={{headerShown:false}} name='Login' component={Loginscreen}/> 
        </Stack.Navigator>
    )

}