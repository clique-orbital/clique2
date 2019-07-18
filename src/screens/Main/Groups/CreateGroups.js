import React from "react";
import { View, Text } from "react-native";
import ContactsList from "../../../components/ContactsList";

class GroupMembersSelect extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <View style={{ bottom: 5, justifyContent: "center" }}>
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>New Group</Text>
          <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>
            Pick your clique
          </Text>
        </View>
      ),
      headerStyle: {
        borderBottomColor: "transparent",
      }
    };
  };

  render() {
    return (
      <ContactsList
        goBack={() => this.props.navigation.goBack()}
        onSubmit={formValues => {
          console.log(formValues);
          this.props.navigation.navigate("GroupDetails", {
            users: formValues,
            title: "Create Groups",
            type: "create",
            headerColor: this.props.navigation.getParam("headerColor")
          })
        }}
      />
    );
  }
}

export default GroupMembersSelect;
