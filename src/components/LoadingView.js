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
    flex: 1,
    backgroundColor: cliqueBlue,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  iconStyle: {
    width: "50%",
    height: "50%",
    marginBottom: "20%"
  }
});

export default LoadingView;
