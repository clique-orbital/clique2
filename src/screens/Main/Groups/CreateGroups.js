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
import Contacts from "react-native-contacts";

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

  checkAndGetPermissionForContacts() {
    Contacts.checkPermission((err, permission) => {
      if (err) throw err;

      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      if (permission === "undefined") {
        console.log("requesting");
        Contacts.requestPermission((err, permission) => {
          if (err) console.log(err);

          if (permission === "authorized") {
            console.log("requesting permission successful");
          } else if (permission === "denied") {
            console.log("requesting permission denied");
          }
        });
      }
      if (permission === "authorized") {
        console.log("Permission already authorized");
      }
      if (permission === "denied") {
        console.log("Permission already denied");
      }
    });
  }

  getContacts() {
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      let dbRef = firebase.database().ref("phoneNumbers");
      dbRef.once("value").then(snapshot => {
        this.setState(prevState => {
          contacts = contacts.filter(contact => {
            const contactPhoneNumbers = contact.phoneNumbers.map(
              phoneNumber => phoneNumber.number
            );
            for (let phoneNumber of contactPhoneNumbers) {
              if (
                snapshot.child(`${phoneNumber}`.replace(/\s/g, "")).exists()
              ) {
                return true;
              }
            }
            return false;
          });

          return {
            ...prevState,
            contacts
          };
        });
      });
    });
  }

  componentWillMount() {
    this.checkAndGetPermissionForContacts();
    this.getContacts();
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
        <Text style={{ fontSize: 16 }}>
          {item.givenName + " " + item.familyName}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderRow}
          keyExtractor={item => item.recordID}
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
