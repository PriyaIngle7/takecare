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

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landingpage">
      <Stack.Screen name="Landingpage" component={Landingpage} />
      <Stack.Screen name="CreateAccountAs" component={CreateAccountAs} />
      <Stack.Screen name="Createcaretaker" component={Createcaretaker} />
      <Stack.Screen name="Features" component={Features}/>
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AlarmScreen" component={AlarmScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
      <Stack.Screen name="LocationScreen" component={LocationScreen} />
      <Stack.Screen name="CaloriesScreen" component={CaloriesScreen} />
      <Stack.Screen name="MedicineGuideScreen" component={MedicineGuideScreen} />
      <Stack.Screen name="StepsScreen" component={StepsScreen} />
      <Stack.Screen name="MedicineMonitoringScreen" component={MedicineMonitoringScreen} />
      <Stack.Screen name="ExerciseClipsScreen" component={ExerciseClipsScreen} />
      <Stack.Screen name="HealthRecordScreen" component={HealthRecordScreen} />
    </Stack.Navigator>
  );
}
