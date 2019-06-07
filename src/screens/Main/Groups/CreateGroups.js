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

import ContinueButton from "../../../components/ContinueButton";
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

  handleSubmit = v => {
    this.props.createGroup(
      "asd",
      this.props.user.uid,
      "This is a new clique!",
      Object.values(v)
    );
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
          <ContinueButton />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.authReducer.user };
};

let form = reduxForm({ form: "createGroups" })(CreateGroups);
export default connect(
  mapStateToProps,
  { createGroup }
)(form);
