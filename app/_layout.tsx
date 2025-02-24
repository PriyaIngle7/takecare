import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Landingpage from "@/components/Page/Landingpage";
import CreateAccountAs from "@/components/Page/CreateAccountAs";
import Createcaretaker from "@/components/Page/Createcaretaker";
import CreateUser from "@/components/Page/CreateUser";
import Login from "@/components/Page/Login";
const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Landingpage"
    >
      <Stack.Screen name="Landingpage" component={Landingpage} />
      <Stack.Screen name="CreateAccountAs" component={CreateAccountAs} />
      <Stack.Screen name="Createcaretaker" component={Createcaretaker} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
