import React from "react";
import { View, Text } from "react-native";
import ContactsList from "../../../components/ContactsList";
import { addMembers } from "../../../store/actions/groups";
import { connect } from "react-redux";
import firebase from "react-native-firebase";

class AddMembers extends React.Component {
  static navigationOptions = () => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <View style={{ bottom: 5, justifyContent: "center" }}>
          <Text style={{ fontSize: 20, color: "white" }}>New members</Text>
        </View>
      )
    };
  };

  onSubmit = formValues => {
    let users_info = {};
    for (let user in formValues) {
      users_info = { ...users_info, [formValues[user].uid]: true };
      this.props
        .addMembers(users_info, this.props.navigation.getParam("group").groupID)
        .then(() => {
          this.props.navigation.getParam("populateState")();
          this.props.navigation.goBack();
        });
    }
  };

  render() {
    console.log(this.props.navigation.getParam("group").users);
    return (
      <ContactsList
        goBack={() => this.props.navigation.goBack()}
        onSubmit={this.onSubmit}
        removeDuplicates={this.props.navigation.getParam("group").users}
      />
    );
  }
}

export default connect(
  null,
  { addMembers }
)(AddMembers);
