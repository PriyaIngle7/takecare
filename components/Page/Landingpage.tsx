import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Landingimage from "../../assets/images/landingimage"; 

type RootStackParamList = {
  Landingpage: undefined;
  CreateAccountAs: undefined;
  Createcaretaker:undefined;
  Login:undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Landingpage">;

const Landingpage = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
      
      {/* SVG Component */}
      <Landingimage width={400} height={300} style={{ marginBottom: 20 }} />

      {/* App Name */}
      <Text style={{ fontSize: 50, fontWeight: "bold", color: "#0057FF" }}>TAKECARE </Text>

      {/* Tagline */}
      <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 10, fontWeight: "500" }}>
        Empowering Care, {"\n"}Anywhere, Anytime.
      </Text>

      {/* Buttons */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#0057FF", paddingVertical: 10, paddingHorizontal: 35, borderRadius: 5, marginRight: 30 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Createcaretaker")}>
          <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>Register</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Landingpage;
