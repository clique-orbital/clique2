import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { cliqueBlue } from "../assets/constants";
import icon from "../assets/icon.png";

class LoadingView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={icon} style={styles.iconStyle} resizeMode="contain" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cliqueBlue,
    elevation: 3
  },
  iconStyle: {
    width: "50%",
    height: "50%",
    marginBottom: "20%"
  }
});

export default LoadingView;
