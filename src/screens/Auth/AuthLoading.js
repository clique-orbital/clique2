import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";

import { cliqueBlue } from "../../assets/constants";
import icon from "../../assets/icon.png";
import { setUserDetails } from "../../store/actions/auth";

class AuthLoading extends React.Component {
  // preload data (loading screen)
  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // update user auth details in redux store
        this.props.setUserDetails(user.toJSON());
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("Auth");
      }
    });
  }

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

export default connect(
  null,
  { setUserDetails }
)(AuthLoading);
