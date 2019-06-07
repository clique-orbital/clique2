import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import firebase from "react-native-firebase";
import { createStackNavigator } from "react-navigation";
import _ from "lodash";
import { cliqueBlue } from "../../assets/constants";
import HeaderTitle from "../../components/HeaderTitle";
import MyIcon from "../../components/MyIcon";
import CreateGroups from "./Groups/CreateGroups";
import ChatScreen from "./Groups/ChatScreen";
import GroupDetails from "./Groups/GroupDetails";

class GroupScreen extends Component {
  state = { groups: [] };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <HeaderTitle title="Groups" />,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate("Create")}>
          <MyIcon
            name="ios-add"
            size={32}
            color="white"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      )
    };
  };

  async componentDidMount() {
    const userUID = firebase.auth().currentUser._user.uid;
    const ref = firebase.database().ref(`users/${userUID}/groups`);
    const snapshot = await ref.once('value');
    const groupIDs = _.keys(snapshot.val());
    groupIDs.map(groupID => {
      const groupRef = firebase.database().ref(`groups/${groupID}`);
      groupRef.once('value').then(snapshot => {
        this.setState(prevState => {
          const groups = prevState.groups;
          groups.push(snapshot.val());
          return {
            ...prevState,
            groups
          }
        })
      })
    });
  }

  renderRow = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity
        style={styles.chatList}
        onPress={() =>
          this.props.navigation.navigate("Chat", {
            group: item
          })
        }
      >
        <Text style={{ fontSize: 16 }}>{item.groupName}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <FlatList
          extraData={this.state.groups}
          data={this.state.groups.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatList: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC"
  }
});

const GroupStack = createStackNavigator(
  {
    Main: GroupScreen,
    Create: CreateGroups,
    Chat: ChatScreen,
    GroupDetails: GroupDetails
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: cliqueBlue
      }
    }
  }
);

GroupStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

export default GroupStack;
