import React from "react";
import { Image, StyleSheet } from "react-native";

const ProfilePicture = props => {
  const styles = StyleSheet.create({
    profilePicture: {
      borderRadius: props.width / 4,
      width: props.width / 2,
      height: props.width / 2,
      justifyContent: "center",
      alignItems: "center"
    }
  });

  return <Image style={styles.profilePicture} source={props.profilePicture} />;
};

export default ProfilePicture;
