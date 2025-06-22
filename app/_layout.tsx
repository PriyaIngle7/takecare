import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";
import { useSessionRedirect } from "@/hooks/useSessionRedirect";
import LoadingScreen from "@/components/LoadingScreen";
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
import PatientMedicineIntake from "@/components/Page/PatientMedicineIntake";

const Stack = createStackNavigator();

// Navigation component that handles authentication-based routing
const NavigationContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Set up session redirect
  useSessionRedirect();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "Features" : "Login"}
    >
      {!isAuthenticated ? (
        // Auth screens - only shown when not authenticated
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Createcaretaker" component={Createcaretaker} />
          <Stack.Screen name="CreateAccountAs" component={CreateAccountAs} />
          <Stack.Screen name="CreateUser" component={CreateUser} />
          <Stack.Screen name="Landingpage" component={Landingpage} />
        </>
      ) : (
        // App screens - only shown when authenticated
        <>
          <Stack.Screen name="Features" component={Features} />
          <Stack.Screen name="AlarmScreen" component={AlarmScreen} />
          <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
          <Stack.Screen name="NotesScreen" component={NotesScreen} />
          <Stack.Screen name="LocationScreen" component={LocationScreen} />
          <Stack.Screen name="CaloriesScreen" component={CaloriesScreen} />
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
          <Stack.Screen name="ChatApplication" component={ChatApplication} />
          <Stack.Screen name="MantainencePage" component={MantainencePage} />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen name="Test2" component={Test2} />
          <Stack.Screen name="PatientMedicineIntake" component={PatientMedicineIntake} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main app layout with authentication provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <PatientProvider>
        <NavigationContent />
      </PatientProvider>
    </AuthProvider>
  );
}