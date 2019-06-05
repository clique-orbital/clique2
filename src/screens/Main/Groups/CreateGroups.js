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

import HeaderTitle from "../../../components/HeaderTitle";

class CreateGroups extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{ bottom: 5 }}>
          <HeaderTitle title="New Group" />
          <Text style={{ color: "white", fontSize: 12 }}>
            Pick your clique members:
          </Text>
        </View>
      )
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
        onPress={() =>
          this.props.navigation.navigate("Chat", {
            username: item.displayName,
            user: item
          })
        }
      >
        <Text style={{ fontSize: 16 }}>{item.displayName}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.uid}
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

export default CreateGroups;
