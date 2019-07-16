import React, { Component } from "react";
import { View } from "react-native";
import Text from "./Text";
import theme from "../assets/theme";

export default class SystemMessageBubble extends Component {
  render() {
    let backgroundColor;
    if (this.props.message.includes("attending")) {
      backgroundColor = this.props.message.includes("not")
        ? theme.colors.red
        : theme.colors.green;
    } else {
      backgroundColor = this.props.color;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 5
        }}
      >
        <View
          style={{
            width: "auto",
            backgroundColor,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 15
          }}
        >
          <Text white center>
            {this.props.message}
          </Text>
        </View>
      </View>
    );
  }
}
