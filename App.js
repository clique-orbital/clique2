import React from "react";
import { View } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import firebase from "react-native-firebase";
import {
  fetchedGroups,
  fetchAGroup,
  sortGroups
} from "./src/store/actions/groups";
import { connect } from "react-redux";
import _ from "lodash";

import GroupScreenStack from "./src/screens/Main/GroupScreenStack";
import NotificationsScreen from "./src/screens/Main/NotificationsScreen";
import SettingsScreen from "./src/screens/Main/SettingsScreen";
import PersonalCalendar from "./src/screens/Main/PersonalCalendar";
import AuthLoading from "./src/screens/Auth/AuthLoading";
import Auth from "./src/screens/Auth/Auth";
import UserDetails from "./src/screens/Auth/UserDetails";

import MyIcon from "./src/components/MyIcon";
import { cliqueBlue } from "./src/assets/constants";

const AppNavigator = createBottomTabNavigator(
  {
    Groups: GroupScreenStack,
    Calendar: PersonalCalendar,
    Notifications: NotificationsScreen,
    Profile: SettingsScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = MyIcon;
        let iconName;
        if (routeName === "Groups") {
          iconName = `md-chatboxes`;
        } else if (routeName === "Calendar") {
          iconName = `md-calendar`;
        } else if (routeName === "Notifications") {
          iconName = `md-notifications`;
        } else if (routeName === "Profile") {
          iconName = `md-contact`;
          // return <ProfilePicture value={this.props.user.photoURL} width={28} />;
        }
        return (
          <View style={{ paddingTop: 5 }}>
            <IconComponent name={iconName} size={28} color={tintColor} />
          </View>
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: cliqueBlue,
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
  async componentDidMount() {
    const uid = firebase.auth().currentUser._user.uid;
    const db = firebase.database();
    await this.fetchGroups();

    for (let groupId of Object.keys(this.props.groups)) {
      db.ref(`groups/${groupId}/last_message`).on("child_changed", snapshot => {
        this.fetchGroup(groupId);
        this.props.sortGroups();
      });
    }

    db.ref(`users/${uid}/groups`).on("child_added", () => {
      this.fetchGroups();
    });
  }

  fetchGroup = groupId => {
    firebase
      .database()
      .ref(`groups/${groupId}/last_message`)
      .once("value", snapshot => {
        this.props.fetchAGroup(groupId, snapshot.val());
      });
  };

  fetchGroups = async () => {
    const userUID = firebase.auth().currentUser._user.uid;
    const snapshot = await firebase
      .database()
      .ref(`users/${userUID}/groups`)
      .once("value");
    const groupIDs = _.keys(snapshot.val());
    const groups = {};
    await Promise.all(
      groupIDs.map(async groupID => {
        const data = await firebase
          .database()
          .ref(`groups/${groupID}`)
          .once("value");
        groups[groupID] = data.val();
      })
    );
    const sortedArr = Object.values(groups).sort(
      (a, b) => a.last_message.timestamp - b.last_message.timestamp
    );
    const sortedGroups = {};
    sortedArr.forEach(group => {
      sortedGroups[group.groupID] = group;
    });
    return this.props.fetchedGroups(sortedGroups);
  };

  render() {
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
  { fetchAGroup, fetchedGroups, sortGroups }
)(App);
