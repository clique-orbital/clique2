import React from "react";
import { View, StatusBar, Platform, YellowBox } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import { connect } from "react-redux";
import GroupScreenStack from "./src/screens/Main/GroupScreenStack";
// import NotificationsScreen from "./src/screens/Main/NotificationsScreen";
import SettingsScreen from "./src/screens/Main/SettingsScreen";
import CalendarStack from "./src/screens/Main/CalendarStack";
import Auth from "./src/screens/Auth/Auth";
import UserDetails from "./src/screens/Auth/UserDetails";
import MyIcon from "./src/components/MyIcon";
import firebase from "react-native-firebase";
import storage from "redux-persist/lib/storage";

import TabBarComponent from "./src/components/TabBarComponent";

YellowBox.ignoreWarnings(["Possible Unhandled Promise Rejection"]);

const AppNavigator = createBottomTabNavigator(
  {
    Groups: GroupScreenStack,
    Calendar: CalendarStack,
    // Notifications: NotificationsScreen,
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
          // } else if (routeName === "Notifications") {
          // iconName = `notifications${focused ? "-active" : "-none"}`;
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
      },
      tabBarComponent: TabBarComponent,
      tabBarOptions: {
        showLabel: false,
        activeTintColor: "black",
        inactiveTintColor: "gray"
      }
    })
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
    // when app is closed and notification is tapped
    storage.getAllKeys(keys => console.log(keys));
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
    }

    const channel = new firebase.notifications.Android.Channel(
      "test-channel",
      "Test Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("My apps test channel");
    // Create the channel
    firebase.notifications().android.createChannel(channel);

    // when app is in the background (iOS, when content_available is true)
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });

    // app in the foreground
    this.notificationListener = firebase
      .notifications()
      .onNotification(async notification => {
        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true
        })

          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle || "")
          .setBody(notification.body)
          .setData(notification.data)
          .setSound("default")
          .android.setChannelId("test-channel") // e.g. the id you chose above
          .android.setPriority(firebase.notifications.Android.Priority.High);
        firebase.notifications().displayNotification(localNotification);
      });

    // when app is in the background and then notification is tapped
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        firebase
          .notifications()
          .removeDeliveredNotification(notification.notificationId);
      });

    this.messageListener = firebase.messaging().onMessage(message => {});
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  render() {
    if (Platform.OS === "android")
      StatusBar.setBackgroundColor(this.props.colors.cliqueBlue);
    return <AppContainer color={"black"} />;
  }
}

export default connect(state => ({ colors: state.theme.colors }))(App);
