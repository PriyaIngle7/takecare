import { Text, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import Landingpage from "@/components/Page/Landingpage";
import CreateAccountAs from "@/components/Page/CreateAccountAs";

const Stack = createStackNavigator();


export default function RootLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Landingpage} />
      <Stack.Screen name="Profile" component={CreateAccountAs} />
    </Stack.Navigator>
  );
}
