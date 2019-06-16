import React from "react";
import { Text } from "react-native";

const HeaderTitle = props => {
  return (
    <Text
      style={{
        fontWeight: "400",
        color: "white",
        fontSize: 20,
        textAlign: "left",
        marginLeft: 10
      }}
    >
      {props.title}
    </Text>
  );
};

export default HeaderTitle;
