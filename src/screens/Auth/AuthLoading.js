import React from "react";
import { View, StyleSheet, Image } from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";

import { cliqueBlue } from "../../assets/constants";
import icon from "../../assets/icon.png";
import { setUserDetails } from "../../store/actions/auth";
import {
  fetchedGroups,
  fetchAGroup,
  sortGroups,
  fetchGroups
} from "../../store/actions/groups";
import { fetchAllEvents } from "../../store/actions/calendar";
import AsyncStorage from "@react-native-community/async-storage";

class AuthLoading extends React.Component {
  storeData = async (key, val) => {
    try {
      val = JSON.stringify(val);
      if (val) {
        await AsyncStorage.setItem(key, val);
      } else {
        console.log("no value");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // preload data (loading screen)
  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        if (user.displayName && user.photoURL) {
          this.storeData("profilePicture", user.photoURL);
          // AsyncStorage.setItem("profilePicture", JSON.stringify(user.photoURL));
          // update user auth details in redux store
          this.props.setUserDetails(user.toJSON());
          await this.props.fetchAllEvents(user.uid);
          await this.props.fetchGroups();
          this.props.navigation.navigate("App");
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
    fetchAGroup,
    fetchedGroups,
    sortGroups,
    fetchGroups,
    fetchAllEvents
  }
)(AuthLoading);
