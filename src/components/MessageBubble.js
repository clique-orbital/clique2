import React from "react";
import { View } from "react-native";
import Text from "./Text";
import theme from "../assets/theme";

class MessageBubble extends React.Component {

  render() {
    return (
      <View style={[this.props.style, { flexDirection: "row", marginTop: this.props.item.firstMsgBySender ? 2 : 0 }]}>
        <View>
          {this.props.item.sender !== this.props.uid && this.props.item.firstMsgBySender && (
            <View
              style={{
                paddingLeft: 5,
                paddingTop: 3,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text header semibold color={this.props.usernameColor}>
                {this.props.item.username}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text
              header
              color={this.props.textColor}
              style={{
                padding: 5,
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
            color={this.props.textColor}
            style={{
              paddingBottom: 5,
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
