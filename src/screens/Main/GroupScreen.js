import React from "react";
import { Text, Button } from "react-native";
import { SafeAreaView } from "react-navigation";

import firebase from "react-native-firebase";

class GroupScreen extends React.Component {
  onPress = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <SafeAreaView>
        <Text>This is the group screen!</Text>
        <Button title="sign out" onPress={this.onPress} ß />
      </SafeAreaView>
    );
  }
}

export default GroupScreen;
