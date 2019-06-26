import React from "react";
import firebase from "react-native-firebase";
import { connect } from "react-redux";

import { setUserDetails } from "../../store/actions/auth";
import { fetchGroups } from "../../store/actions/groups";
import { fetchAllEvents, fetchPersonalEvents } from "../../store/actions/calendar";
import { populateGroups } from "../../store/actions/messageCounter";

import NetInfo from "@react-native-community/netinfo";

import LoadingView from "../../components/LoadingView";

class AuthLoading extends React.Component {
  // preload data (loading screen)
  async componentDidMount() {
    //firebase.auth().currentUser.delete();
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        if (user.displayName && user.photoURL) {
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              this.props.setUserDetails(user);
              this.props
                .fetchGroups()
                .then(() => this.props.fetchAllEvents(user.uid))
                .then(() => this.props.fetchPersonalEvents(user.uid))
                .then(() => this.props.navigation.navigate("App"));
            } else {
              this.props.navigation.navigate("App");
            }
          });
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
    return <LoadingView />;
  }
}

export default connect(
  null,
  {
    setUserDetails,
    fetchGroups,
    fetchAllEvents,
    populateGroups,
    fetchPersonalEvents
  }
)(AuthLoading);
