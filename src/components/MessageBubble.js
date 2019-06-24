import React from "react";
import { View } from "react-native";
import Text from "./Text";

class MessageBubble extends React.Component {
  render() {
    return (
      <View style={[this.props.style, { flexDirection: "row" }]}>
        <View>
          {this.props.item.sender !== this.props.uid && (
            <View
              style={{
                padding: 2,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text white header semibold>
                {this.props.item.username}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text
              header
              white
              style={{
                padding: 7,
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
            style={{
              color: "#eee",
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
