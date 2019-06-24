import React from "react";
import { View } from "react-native";
import Text from "./Text";
import theme from "../assets/theme";

class MessageBubble extends React.Component {
  render() {
    return (
      <View style={[this.props.style, { flexDirection: "row" }]}>
        <View>
          {this.props.item.sender !== this.props.uid && (
            <View
              style={{
                paddingLeft: 7,
                paddingTop: 3,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text header semibold color={theme.colors.light_chat_username}>
                {this.props.item.username}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text
              header
              black
              style={{
                paddingTop: 4,
                paddingBottom: 7,
                paddingHorizontal: 7,
                width: "auto",
                maxWidth: this.props.maxWidth * 0.85
              }}
            >
              {this.props.item.message}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>
          <Text
            black
            style={{
              paddingBottom: 7,
              paddingRight: 10,
              fontSize: 10
            }}
          >
            {this.props.convertTime(this.props.item.timestamp)}
          </Text>
        </View>
      </View>
    );
  }
}

export default MessageBubble;
