import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform
} from "react-native";
import firebase from "react-native-firebase";
import Contacts from "react-native-contacts";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import ContinueButton from "../../../components/ContinueButton";
import MyCheckBox from "../../../components/MyCheckbox";
import { createGroup } from "../../../store/actions/groups";

class GroupMembersSelect extends React.Component {
  static navigationOptions = () => {
    return {
      headerTitle: (
        <View
          style={{ bottom: 5, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
            New Group
          </Text>
          <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>
            Pick your clique members
          </Text>
        </View>
      )
    };
  };

  state = { users: [], count: 0 };

  async componentWillMount() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Clique Contacts Permission",
        message: "Clique would like to access your contacts.",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      })
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.getContacts();
          } else {
            this.props.navigation.goBack();
          }
        })
        .catch(err => {
          console.log("PermissionsAndroid", err);
        });
    } else if (Platform.OS === "ios") {
      Contacts.requestPermission((err, permission) => {
        if (err) console.log(err);
        if (permission === "authorized") {
          this.getContacts();
        } else if (permission === "denied") {
          console.log("requesting permission denied");
          this.props.navigation.goBack();
        }
      });
    }
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

  handleSubmit = formValues => {
    this.props.navigation.navigate("GroupDetails", {
      users: formValues
    });
  };

  count = increase => {
    if (increase) {
      this.setState(prevState => {
        return { ...prevState, count: prevState.count + 1 };
      });
    } else {
      this.setState(prevState => {
        return { ...prevState, count: prevState.count - 1 };
      });
    }
  };

  renderCheckBox = props => {
    return (
      <MyCheckBox
        {...props.input}
        title={props.label}
        value={props.user}
        callback={this.count}
      />
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

  renderButton = () => {
    return (
      <TouchableOpacity
        title="Create"
        onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
        style={{ position: "absolute", top: "90%", left: "80%" }}
      >
        <ContinueButton name="arrow-forward" />
      </TouchableOpacity>
    );
  };

  renderFlatList = () => {
    return (
      <View style={{ display: "flex", height: "100%" }}>
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderRow}
          keyExtractor={item => item.recordID}
        />
        {this.state.count > 0 ? this.renderButton() : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{ display: "flex", height: "100%" }}>
        {this.renderFlatList()}
      </View>
    );
  }
}

let form = reduxForm({ form: "groupMembersSelector" })(GroupMembersSelect);
export default connect(
  null,
  { createGroup }
)(form);
