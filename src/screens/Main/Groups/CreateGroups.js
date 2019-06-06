import React from "react";
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
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import cliqueBlue from "../../../assets/constants";
import MyIcon from "../../../components/MyIcon";
import MyCheckBox from "../../../components/MyCheckbox";
import { createGroup } from "../../../store/actions/groups";
import HeaderTitle from "../../../components/HeaderTitle";

class CreateGroups extends React.Component {
  state = { users: [] };

  componentWillMount() {
    this.checkAndGetPermissionForContacts();
    this.getContacts();
  }

  handleSubmit = values => {
    console.log(values);
  };

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

  renderCheckBox = props => {
    return (
      <MyCheckBox {...props.input} title={props.label} value={props.user} />
    );
  };

  renderRow = ({ item }) => {
    return (
      <Field
        name={`contact${item.givenName}`}
        component={this.renderCheckBox}
        user={item}
        label={item.givenName + " " + item.familyName}
      />
    );
  };

  render() {
    return (
      <View style={{ display: "flex", height: "100%" }}>
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderRow}
          keyExtractor={item => item.recordID}
        />
        <TouchableOpacity
          title="Create"
          onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
          style={{ position: "absolute", top: "90%", left: "80%" }}
        >
          <View
            style={{
              backgroundColor: "#134782",
              height: 46,
              width: 46,
              borderRadius: 23,
              flex: 1,
              justifyContent: "center"
            }}
          >
            <MyIcon
              name="arrow-forward"
              size={35}
              color="white"
              type="material"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

let form = reduxForm({ form: "createGroups" })(CreateGroups);
export default connect(
  null,
  { createGroup }
)(form);
