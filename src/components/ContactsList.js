import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet
} from "react-native";
import firebase from "react-native-firebase";
import Contacts from "react-native-contacts";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import ContinueButton from "./ContinueButton";
import MyCheckBox from "./MyCheckbox";
import { createGroup } from "../store/actions/groups";
import Spinner from "./Spinner";
import GroupPicture from "./GroupPicture";

class ContactsList extends React.Component {
  state = { contacts: [], count: 0, loading: true };

  askPermissionAndGetContacts() {
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
            this.props.goBack();
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
          this.props.goBack();
        }
      });
    }
  }

  componentWillMount() {
    this.askPermissionAndGetContacts();
  }

  getContacts() {
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      let dbRef = firebase.database().ref("phoneNumbers");
      dbRef
        .once("value")
        .then(snapshot => {
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
        })
        .then(() => {
          for (let i = 0; i < this.state.contacts.length; i++) {
            const number = this.state.contacts[i].phoneNumbers
              .map(n => n.number)[0]
              .replace(/\s/g, "");
            firebase
              .database()
              .ref(`phoneNumbers/${number}/`)
              .once("value")
              .then(snapshot => {
                this.setState(prevState => {
                  const newContacts = [...prevState.contacts];
                  newContacts[i].photoURL = snapshot.val().photoURL;
                  newContacts[i].uid = snapshot.val().uid;
                  return {
                    ...prevState,
                    contacts: newContacts
                  };
                });
              });
          }
        });
    });

    this.setState({ loading: false });
  }

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
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingVertical: 5,
          alignItems: "center",
          borderBottomColor: "lightgrey",
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
      >
        <View style={{ paddingLeft: 10 }}>
          <GroupPicture source={{ uri: item.photoURL }} value={0.1} />
        </View>
        <Field
          name={`contact${item.givenName}`}
          component={this.renderCheckBox}
          user={item}
          label={item.givenName + " " + item.familyName}
        />
      </View>
    );
  };
  removeDuplicates = (groupUsers, contacts) => {
    let obj = {};
    for (let user in contacts) {
      if (!groupUsers[user]) {
        obj[user] = true;
      }
    }
    return obj;
  };

  handleSubmit = formValues => {
    console.log(formValues);
    this.props.onSubmit(formValues);
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
    let contacts = this.state.contacts;
    if (this.props.removeDuplicates) {
      contacts = contacts.filter(
        user => !this.props.removeDuplicates[user.uid]
      );
    }

    return (
      <View style={{ display: "flex", height: "100%" }}>
        <FlatList
          data={contacts}
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
        {this.state.loading && <Spinner />}
      </View>
    );
  }
}

let form = reduxForm({ form: "contactList" })(ContactsList);
export default connect(
  null,
  { createGroup }
)(form);
