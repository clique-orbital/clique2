import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { connect } from "react-redux";

class Spinner extends React.Component {
  render() {
    return (
      <View style={[styles.loading, { backgroundColor: this.props.backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5
  }
});

const mapStateToProp = state => {
  return {
    backgroundColor: state.theme.colors.spinnerBg
  }
}

export default connect(mapStateToProp)(Spinner);
