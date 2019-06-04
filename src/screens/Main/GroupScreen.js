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

class GroupScreen extends Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Groups" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  state = { users: [] };

  componentWillMount() {
    //const user = firebase.auth().currentUser;
    //let dbRef = firebase.database().ref("users");
    //dbRef.on("child_added", snapshot => {
    //let person = snapshot.val();
    //person.phoneNumber = snapshot.phoneNumber;
    //if (person.phoneNumber === user.phoneNumber) {
    //person.displayName = "Saved Messages";
    //}
    //this.setState(prevState => {
    //return {
    //users: [...prevState.users, person]
    //};
    //});
    //});
  }

  renderRow = ({ item }) => {
    return (
      <TouchableOpacity style={styles.chatList} onPress={() => alert("HELOO")}>
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

const GroupStack = createStackNavigator({
  Main: GroupScreen
});

export default GroupStack;
