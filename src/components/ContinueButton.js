import React from "react";
import { View } from "react-native";
import MyIcon from "./MyIcon";

const ContinueButton = props => {
  return (
    <View
      style={{
        backgroundColor: "#134782",
        height: 46,
        width: 46,
        borderRadius: 23,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <MyIcon name="arrow-forward" size={30} color="white" type="material" />
    </View>
  );
};

export default ContinueButton;
