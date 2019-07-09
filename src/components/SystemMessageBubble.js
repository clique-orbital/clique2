import React, { Component } from "react";
import { View } from "react-native";
import Text from "./Text";

export default class SystemMessageBubble extends Component {
  render() {
    let backgroundColor = "#2474f7";
    if (this.props.message.includes("attending")) {
      backgroundColor = this.props.message.includes("not") ? "#E83838" : "#65c681";
    }
    return (
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 5, }}>
        <View style={{ width: "auto", backgroundColor, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 }}>
          <Text white center>{this.props.message}</Text>
        </View>
      </View>
    )
  }
}