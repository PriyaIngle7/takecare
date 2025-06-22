import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Icon } from "react-native-elements";

interface SettingItemProps {
  iconName: string;
  label: string;
  value: string;
  onPress: () => void;
}

const SettingsScreen: React.FC = ({navigation}:any) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const renderSettingItem = ({ iconName, label, value, onPress }: SettingItemProps) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name={iconName} type="material-community" size={24} color="#000" />
        {editingEmail && label === "Email" ? (
          <TextInput
            style={{ marginLeft: 10, fontSize: 16, borderBottomWidth: 1, width: 200 }}
            value={email}
            onChangeText={setEmail}
            onBlur={() => setEditingEmail(false)}
          />
        ) : editingPhone && label === "Phone Number" ? (
          <TextInput
            style={{ marginLeft: 10, fontSize: 16, borderBottomWidth: 1, width: 200 }}
            value={phone}
            onChangeText={setPhone}
            onBlur={() => setEditingPhone(false)}
          />
        ) : (
          <Text style={{ marginLeft: 10, fontSize: 16 }}>{value || `Enter ${label}`}</Text>
        )}
      </View>
      <Icon name="chevron-right" type="material-community" size={24} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <Icon name="arrow-left" type="material-community" size={28} color="blue" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "blue", marginLeft: 10 }}>Settings</Text>
      </View>
      
      {renderSettingItem({ iconName: "phone", label: "Phone Number", value: phone, onPress: () => setEditingPhone(true) })}
      {renderSettingItem({ iconName: "email", label: "Email", value: email, onPress: () => setEditingEmail(true) })}
      {renderSettingItem({ iconName: "lock", label: "Change Password", value: "", onPress: () => {} })}
      {renderSettingItem({ iconName: "translate", label: "Language", value: "", onPress: () => {} })}
      {renderSettingItem({ iconName: "bell", label: "Notifications", value: "", onPress: () => {} })}
      {renderSettingItem({ iconName: "file-document", label: "Terms of service & privacy policy", value: "", onPress: () => {} })}
      {renderSettingItem({ iconName: "account", label: "Developer contact information", value: "", onPress: () => {} })}
      
      
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15 }}>
        <Icon name="logout" type="material-community" size={24} color="red" />
        <Text style={{ marginLeft: 10, fontSize: 16, color: "red" }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;
