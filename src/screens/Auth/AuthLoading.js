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
import AsyncStorage from "@react-native-community/async-storage";
import LoadingView from "../../components/LoadingView";

class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    // this.removeNotificationDisplayedListener = this.removeNotificationDisplayedListener.bind(this);
    // this.removeNotificationListener = this.removeNotificationListener.bind(this);
    // this.removeNotificationOpenedListener = this.removeNotificationOpenedListener.bind(this);
  }

  componentDidMount = async () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.checkPermission(user.uid);
        // console.log("hellow")

        // const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        // if (notificationOpen) {
        //   const action = notificationOpen.action;
        //   const notification: Notification = notificationOpen.notification;
        //   var seen = [];
        //   alert(JSON.stringify(notification.data, function (key, val) {
        //     if (val != null && typeof val == "object") {
        //       if (seen.indexOf(val) >= 0) {
        //         return;
        //       }
        //       seen.push(val);
        //     }
        //     return val;
        //   }));
        // }
        // const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
        //   .setDescription('My apps test channel');
        // // Create the channel
        // firebase.notifications().android.createChannel(channel);
        // console.log(channel);
        // this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        //   console.log('a');
        //   // Process your notification as required
        //   // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        // });
        // this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        //   // Process your notification as required
        //   console.log('a');

        //   notification
        //     .android.setChannelId('test-channel')
        //     .android.setSmallIcon('ic_launcher');
        //   firebase.notifications()
        //     .displayNotification(notification);

        // });
        // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        //   console.log('a');
        //   // Get the action triggered by the notification being opened
        //   const action = notificationOpen.action;
        //   // Get information about the notification that was opened
        //   const notification: Notification = notificationOpen.notification;
        //   var seen = [];
        //   alert(JSON.stringify(notification.data, function (key, val) {
        //     if (val != null && typeof val == "object") {
        //       if (seen.indexOf(val) >= 0) {
        //         return;
        //       }
        //       seen.push(val);
        //     }
        //     return val;
        //   }));
        //   firebase.notifications().removeDeliveredNotification(notification.notificationId);

        // });

        // const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
        //   .setDescription('My apps test channel');
        // // Create the channel
        // firebase.notifications().android.createChannel(channel);

        // this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        //   notification.android.setChannelId('test-channel')
        //   firebase.notifications().displayNotification(notification);
        //   console.log("Notification Displayed: ");
        //   console.log(notification);
        //   // Process your notification as required
        //   // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        // });

        // this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
        //   // Process your notification as required
        //   notification
        //     .android.setChannelId('test-channel');
        //   firebase.notifications().displayNotification(notification);
        //   console.log("Notification");
        //   console.log(notification);
        // });

        // this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        //   // Get the action triggered by the notification being opened
        //   const action = notificationOpen.action;
        //   // Get information about the notification that was opened
        //   const notification = notificationOpen.notification;
        //   console.log(action);
        //   console.log(notification);
        // });

        if (user.displayName && user.photoURL) {
          NetInfo.fetch()
            .then(state => {
              if (state.isConnected) {
                this.props.setUserDetails(user);
                this.props
                  .fetchGroups()
                  .then(() => this.props.fetchAllEvents(user.uid))
                  .then(() => this.props.fetchPersonalEvents(user.uid));
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
  }

  componentWillUnmount() {
    // this.removeNotificationDisplayedListener();
    // this.removeNotificationListener();
    // this.removeNotificationOpenedListener();
    // this.notificationDisplayedListener();
    // this.notificationListener();
    // this.notificationOpenedListener();
    this.unsubscribe();
  }

  checkPermission(uid) {
    firebase.messaging().hasPermission()
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
    firebase.messaging().requestPermission()
      .then(() => {
        this.getToken(uid);
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  async getToken(uid) {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("before fcmToken: ", fcmToken);
    fcmToken = await firebase.messaging().getToken();
    console.log("after fcmToken: " + fcmToken);
    firebase.database().ref(`users/${uid}/notificationToken`).set(fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log("after fcmToken: ", fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log(uid);
        firebase.database().ref(`users/${uid}/notificationToken`).set(fcmToken);
      }
    }
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
