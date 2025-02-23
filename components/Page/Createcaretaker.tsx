import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
const { width } = Dimensions.get("window");
const scale = width / 320;
const Createcaretaker = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View>
      <Text>Createcaretaker</Text>
    </View>
  )
}

export default Createcaretaker

