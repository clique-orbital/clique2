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
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 2
      }}
    >
      <MyIcon name={props.name} size={30} color="white" type="material" />
    </View>
  );
};

export default ContinueButton;
