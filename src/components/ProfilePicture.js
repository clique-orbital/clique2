import React from "react";
import { Image, StyleSheet } from "react-native";

class ProfilePicture extends React.Component {
  constructor(props) {
    super(props);
    this.styles = StyleSheet.create({
      profilePicture: {
        borderRadius: props.width / 4,
        width: props.width / 2,
        height: props.width / 2,
        justifyContent: "center",
        alignItems: "center"
      }
    });
  }

  render() {
    return (
      <Image
        style={this.styles.profilePicture}
        source={this.props.profilePicture}
      />
    );
  }
}

export default ProfilePicture;
