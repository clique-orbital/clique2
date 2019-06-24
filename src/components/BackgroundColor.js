import React from "react";
import { View, StyleSheet } from "react-native";
import theme from "../assets/theme";

class BackgroundColor extends React.Component {
  render() {
    return <View style={styles.background} />;
  }
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.light_chat_background,
    zIndex: -10
  }
});

export default BackgroundColor;
