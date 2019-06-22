import React from "react";
import { View, StyleSheet, Image } from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";

import { cliqueBlue } from "../../assets/constants";
import icon from "../../assets/icon.png";
import { setUserDetails } from "../../store/actions/auth";
import { fetchGroups } from "../../store/actions/groups";
import { fetchAllEvents } from "../../store/actions/calendar";
import AsyncStorage from "@react-native-community/async-storage";

class AuthLoading extends React.Component {
  storeData = async (key, val) => {
    try {
      val = JSON.stringify(val);
      if (val) {
        return AsyncStorage.setItem(key, val);
      } else {
        return Promise.reject("no value");
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  // preload data (loading screen)
  async componentDidMount() {
    //firebase.auth().currentUser.delete();
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        if (user.displayName && user.photoURL) {
          this.storeData("profilePicture", user.photoURL)
            .then(() => this.props.setUserDetails(user))
            .then(() => this.props.fetchGroups())
            .then(() => this.props.fetchAllEvents(user.uid))
            .then(() => this.props.navigation.navigate("App"));
        } else {
          // get user to set username and profile picture
          this.props.navigation.navigate("UserDetails");
        }
      } else {
        // go to authentication if user is not signed in
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
  {
    setUserDetails,

    fetchGroups,
    fetchAllEvents
  }
)(AuthLoading);
