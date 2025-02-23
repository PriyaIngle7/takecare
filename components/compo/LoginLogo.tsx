import { StyleSheet, Dimensions, View } from "react-native";
import React from "react";
const { width } = Dimensions.get("window");
const scale = width / 320;
const LoginLogo = (props: any) => {
  return (
    <View
      style={{
        backgroundColor: "#ECECEC",
        borderRadius: 10 * scale,
        paddingVertical: 5 * scale,
        paddingHorizontal: 5 * scale,
        marginTop: 5 * scale,
        alignSelf:"center",
      }}
    >
      {props.componentPass}
    </View>
  );
};

export default LoginLogo;

const styles = StyleSheet.create({});
