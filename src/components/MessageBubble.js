import React from "react";
import { View } from "react-native";
import Text from "./Text";

class MessageBubble extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        {this.props.item.sender !== this.props.uid && (
          <View style={{ padding: 2 }}>
            <Text white header semibold>
              {this.props.item.username}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexWrap: "wrap" }}>
            <Text header white style={{ padding: 7 }}>
              {this.props.item.message}
            </Text>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <Text
              style={{
                color: "#eee",
                paddingRight: 13,
                paddingBottom: 7,
                fontSize: 10
              }}
            >
              {this.props.convertTime(this.props.item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default MessageBubble;
