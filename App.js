import React from "react";
import { View, StatusBar, Platform } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import { connect } from "react-redux";
import GroupScreenStack from "./src/screens/Main/GroupScreenStack";
import NotificationsScreen from "./src/screens/Main/NotificationsScreen";
import SettingsScreen from "./src/screens/Main/SettingsScreen";
import CalendarStack from "./src/screens/Main/CalendarStack";
import Auth from "./src/screens/Auth/Auth";
import UserDetails from "./src/screens/Auth/UserDetails";
import MyIcon from "./src/components/MyIcon";
import { cliqueBlue } from "./src/assets/constants";
import firebase from "react-native-firebase";

const AppNavigator = createBottomTabNavigator(
  {
    Groups: GroupScreenStack,
    Calendar: CalendarStack,
    Notifications: NotificationsScreen,
    Profile: SettingsScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = MyIcon;
        let iconName;
        let iconType = "material";
        if (routeName === "Groups") {
          iconName = `chat${focused ? "" : "-bubble-outline"}`;
        } else if (routeName === "Calendar") {
          iconType = "material-community";
          iconName = `calendar${
            focused || Platform.OS === "ios" ? "" : "-blank-outline"
          }`;
        } else if (routeName === "Notifications") {
          iconName = `notifications${focused ? "-active" : "-none"}`;
        } else if (routeName === "Profile") {
          iconName = `person${focused ? "" : "-outline"}`;
        }
        return (
          <View style={{ paddingTop: 5 }}>
            <IconComponent
              name={iconName}
              size={28}
              color={tintColor}
              type={iconType}
            />
          </View>
        );
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "black",
      inactiveTintColor: "gray"
    }
  }
);

const AuthNavigator = createSwitchNavigator(
  {
    Auth: Auth,
    UserDetails: UserDetails
  },
  {
    initialRouteName: "Auth"
  }
);

const InitialNavigator = createSwitchNavigator(
  {
    App: AppNavigator,
    Auth: AuthNavigator
  },
  {
    initialRouteName: "Auth"
  }
);

const AppContainer = createAppContainer(InitialNavigator);

class App extends React.Component {
  async componentDidMount() {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      var seen = [];
      alert(
        JSON.stringify(notification.data, function(key, val) {
          if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        })
      );
    }
    const channel = new firebase.notifications.Android.Channel(
      "test-channel",
      "Test Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("My apps test channel");
    // Create the channel
    firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        // Process your notification as required
        notification.android.setChannelId("test-channel");
        firebase.notifications().displayNotification(notification);
      });
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        var seen = [];
        alert(
          JSON.stringify(notification.data, function(key, val) {
            if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                return;
              }
              seen.push(val);
            }
            return val;
          })
        );
        firebase
          .notifications()
          .removeDeliveredNotification(notification.notificationId);
      });
  }
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }
  render() {
    if (Platform.OS === "android") StatusBar.setBackgroundColor("#0d2f55");
    return <AppContainer />;
  }
}

export default connect()(App);
