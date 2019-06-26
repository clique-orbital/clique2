import React from "react";
import { View, Text } from "react-native";
import ContactsList from "../../../components/ContactsList";

class GroupMembersSelect extends React.Component {
  static navigationOptions = () => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <View style={{ bottom: 5, justifyContent: "center" }}>
          <Text style={{ fontSize: 20, color: "white" }}>New Group</Text>
          <Text style={{ color: "white", fontSize: 12 }}>
            Pick your clique members
          </Text>
        </View>
      )
    };
  };

  render() {
    return (
      <ContactsList
        goBack={() => this.props.navigation.goBack()}
        onSubmit={formValues =>
          this.props.navigation.navigate("GroupDetails", {
            users: formValues
          })
        }
      />
    );
  }
}

export default GroupMembersSelect;
