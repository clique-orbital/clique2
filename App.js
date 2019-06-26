import React from "react";
import { View, StatusBar, Platform } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import {
  fetchGroups,
  fetchGroup,
  sortGroups
} from "./src/store/actions/groups";
import { connect } from "react-redux";
import _ from "lodash";

import GroupScreenStack from "./src/screens/Main/GroupScreenStack";
import NotificationsScreen from "./src/screens/Main/NotificationsScreen";
import SettingsScreen from "./src/screens/Main/SettingsScreen";
// import PersonalCalendar from "./src/screens/Main/PersonalCalendar";
import CalendarStack from "./src/screens/Main/CalendarStack"
import AuthLoading from "./src/screens/Auth/AuthLoading";
import Auth from "./src/screens/Auth/Auth";
import UserDetails from "./src/screens/Auth/UserDetails";

import MyIcon from "./src/components/MyIcon";
import { cliqueBlue } from "./src/assets/constants";

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
          // return <ProfilePicture value={this.props.user.photoURL} width={28} />;
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
    AuthLoading: AuthLoading,
    App: AppNavigator,
    Auth: AuthNavigator
    // UserDetails: UserDetails
  },
  {
    initialRouteName: "AuthLoading"
  }
);

const AppContainer = createAppContainer(InitialNavigator);

class App extends React.Component {
  render() {
    if (Platform.OS === "android") StatusBar.setBackgroundColor(cliqueBlue);
    return <AppContainer />;
  }
}

const mapStateToProps = state => {
  return {
    groups: state.groupsReducer.groups
  };
};

export default connect(
  mapStateToProps,
  { fetchGroup, fetchGroups, sortGroups }
)(App);
