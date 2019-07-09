import React, { Component } from "react";
import { View } from "react-native";
import Text from "./Text";

export default class SystemMessageBubble extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "auto", marginHorizontal: 20, backgroundColor: "#2374f7", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 }}>
          <Text white>{this.props.message}</Text>
        </View>
      </View>
    )
  }
}