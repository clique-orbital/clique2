import React from "react";
import firebase from "react-native-firebase";
import { connect } from "react-redux";

import { setUserDetails } from "../../store/actions/auth";
import { fetchGroups } from "../../store/actions/groups";
import {
  fetchAllEvents,
  fetchPersonalEvents
} from "../../store/actions/calendar";
import { populateGroups } from "../../store/actions/messageCounter";

import NetInfo from "@react-native-community/netinfo";
import LoadingView from "../../components/LoadingView";

class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    // this.removeNotificationDisplayedListener = this.removeNotificationDisplayedListener.bind(this);
    // this.removeNotificationListener = this.removeNotificationListener.bind(this);
    // this.removeNotificationOpenedListener = this.removeNotificationOpenedListener.bind(this);
  }

  componentDidMount = () => {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      this.getToken(firebase.auth().currentUser.uid)
    })
    
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.displayName && user.photoURL) {
          NetInfo.fetch()
            .then(state => {
              if (state.isConnected) {
                this.props.setUserDetails(user);
                this.props
                  .fetchGroups()
                  .then(() => this.props.fetchAllEvents(user.uid))
                  .then(() => this.props.fetchPersonalEvents(user.uid))
                  .then(() => this.checkPermission(user.uid));
              }
            })
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
  };

  checkPermission(uid) {
    return firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission granted");
          this.getToken(uid);
        } else {
          console.log("Request Permission");
          this.requestPermission(uid);
        }
      });
  }

  requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken(uid);
      })
      .catch(error => {
        console.log("permission rejected");
      });
  }

  getToken(uid) {
    fcmToken = await firebase.messaging().getToken();
    return firebase
      .database()
      .ref(`users/${uid}/notificationToken`)
      .set(fcmToken);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.onTokenRefreshListener();
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
