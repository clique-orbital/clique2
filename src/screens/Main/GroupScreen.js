import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import firebase from "react-native-firebase";
import { createStackNavigator } from "react-navigation";
import { cliqueBlue } from "../../assets/constants";
import HeaderTitle from "../../components/HeaderTitle";
import MyIcon from "../../components/MyIcon";
import CreateGroups from "./Groups/CreateGroups";
import ChatScreen from "./Groups/ChatScreen";

class GroupScreen extends Component {
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
      ),
      headerStyle: {
        backgroundColor: cliqueBlue
      }
    };
  };

  state = { users: [] };

  componentWillMount() {
    const user = firebase.auth().currentUser;
    let dbRef = firebase.database().ref("users");
    dbRef.on("child_added", snapshot => {
      let person = snapshot.val();
      if (person.phoneNumber === user.phoneNumber) {
        person.displayName = "Saved Messages";
      }
      this.setState(prevState => {
        return {
          users: [...prevState.users, person]
        };
      });
    });
  }

  renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatList}
        onPress={() => this.props.navigation.navigate("Chat")}
      >
        <Text style={{ fontSize: 16 }}>{item.displayName}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.uid}
        />
      </SafeAreaView>
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
    Chat: ChatScreen
  },
  {
    initialRouteName: "Main"
  }
);

export default GroupStack;
