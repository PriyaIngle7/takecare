import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Medicalimg from "../../assets/images/medicalkit"; 

type RootStackParamList = {
  Createcaretaker: undefined;
  CreateUser: undefined; 
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Createcaretaker">;

const CreateAccountAs = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFF" }}>
      
      
  <Medicalimg width={300} height={200} style={{ transform: [{ scale: 2 }], marginBottom: 20 }} />
  


    
      <Text style={{ fontSize: 70, fontWeight: "bold", color: "#0057FF" }}>TAKECARE</Text>

      
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5 }}>Create Account</Text>

     
      <Text style={{ fontSize: 16, color: "#555", marginVertical: 10 }}>as:</Text>

    
      <TouchableOpacity
        style={{
          backgroundColor: "#0057FF",
          paddingVertical: 12,
          paddingHorizontal: 50,
          borderRadius: 8,
          marginBottom: 15,
          width: "80%",
          alignItems: "center"
        }}
        onPress={() => navigation.navigate("Createcaretaker")} 
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Caretaker</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#0057FF",
          paddingVertical: 12,
          paddingHorizontal: 50,
          borderRadius: 8,
          width: "80%",
          alignItems: "center"
        }}
        onPress={() => navigation.navigate("CreateUser")} 
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>User</Text>
      </TouchableOpacity>

    </View>
  );
};

export default CreateAccountAs;
