import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import SettingsImage from "../../assets/images/settingsImg";
import Settings11 from "../../assets/images/settings11";
import { SafeAreaView } from "react-native-safe-area-context";
import NameCard from "../compo/NameCard";
const { width } = Dimensions.get("window");
const scale = width / 320;
export default function ExerciseClipsScreen() {
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>

      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20 * scale,
          justifyContent: "space-around",
        }}
        >
          <View style={{flexDirection:"row" ,alignItems:"center"}}>
        <Image
          style={{
            width: 50 * scale,
            height: 50 * scale,
            borderRadius: 100 * scale,
            
          }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
          }}
          />
        <View style={{paddingHorizontal:10*scale}}>
          <Text style={{ fontSize: 14 * scale, color: "#1E90FF" }}>
            Hi, Welcome Back
          </Text>
          <Text style={{ fontSize: 16 * scale, fontWeight: "bold" }}>
            John Doe
          </Text>
        </View>
          </View>
        <View style={{ flexDirection: "row" }}>
          <SettingsImage />
          <Settings11 />
        </View>
      </View> */}
      <NameCard/>
    </View>
  );
}
