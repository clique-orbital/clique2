import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";

class GroupPicture extends React.Component {
  render() {
    const { value } = this.props;
    return (
      <Image
        source={this.props.source}
        style={{
          height: Dimensions.get("window").width * value,
          width: Dimensions.get("window").width * value,
          borderRadius: (Dimensions.get("window").width * value) / 2
        }}
      />
    );
  }
}

export default GroupPicture;
