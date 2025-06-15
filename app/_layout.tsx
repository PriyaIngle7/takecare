import { createStackNavigator } from "@react-navigation/stack";
import Landingpage from "@/components/Page/Landingpage";
import CreateAccountAs from "@/components/Page/CreateAccountAs";
import Createcaretaker from "@/components/Page/Createcaretaker";
import CreateUser from "@/components/Page/CreateUser";
import Login from "@/components/Page/Login";
import AlarmScreen from "@/components/Page/AlarmScreen";
import ActivityScreen from "@/components/Page/ActivityScreen";
import NotesScreen from "@/components/Page/NotesScreen";
import LocationScreen from "@/components/Page/LocationScreen";
import CaloriesScreen from "@/components/Page/CaloriesScreen";
import Features from "@/components/Page/Features";
import MedicineGuideScreen from "@/components/Page/MedicineGuideScreen";
import StepsScreen from "@/components/Page/StepsScreen";
import MedicineMonitoringScreen from "@/components/Page/MedicineMonitoringScreen";
import ExerciseClipsScreen from "@/components/Page/ExerciseClipsScreen";
import HealthRecordScreen from "@/components/Page/HealthRecordScreen";
import ProfileScreen from "@/components/Page/Profile";
import SettingsScreen from "@/components/Page/Settings";
import UserList from "@/components/Page/UserList";
import ChatApplication from "@/components/Page/ChatApplication";
import Test from "@/components/Page/Test";
import Test2 from "@/components/Page/Test2";
import MantainencePage from "@/components/Page/MantainencePage";

const Stack = createStackNavigator();
// CJ0KL4
export default function RootLayout() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Createcaretaker"
    >
      <Stack.Screen name="Createcaretaker" component={Createcaretaker} />
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Features" component={Features} />
      <Stack.Screen name="AlarmScreen" component={AlarmScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
      <Stack.Screen name="LocationScreen" component={LocationScreen} />
      {/* <Stack.Screen name="CaloriesScreen" component={CaloriesScreen} /> */}
      <Stack.Screen name="CaloriesScreen" component={MantainencePage} />
      <Stack.Screen
        name="MedicineGuideScreen"
        component={MedicineGuideScreen}
      />
      <Stack.Screen name="StepsScreen" component={StepsScreen} />
      <Stack.Screen
        name="MedicineMonitoringScreen"
        component={MedicineMonitoringScreen}
      />
      <Stack.Screen
        name="ExerciseClipsScreen"
        component={ExerciseClipsScreen}
      />
      <Stack.Screen name="HealthRecordScreen" component={HealthRecordScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="UserList" component={UserList} />
      {/* <Stack.Screen name="ChatApplication" component={ChatApplication} /> */}
      <Stack.Screen name="ChatApplication" component={MantainencePage} />
      <Stack.Screen name="MantainencePage" component={MantainencePage} />
    </Stack.Navigator>
  );
}