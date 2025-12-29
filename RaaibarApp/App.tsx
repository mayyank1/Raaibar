import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import SplashScreen from "./src/screens/SplashScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{headerShown: true}} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{headerShown: false}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;