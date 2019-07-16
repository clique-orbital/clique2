import React from "react";
import {
  View,
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
      dbRef.once("value").then(snapshot => {
        this.setState(prevState => {
          contacts = contacts
            .map(contact => {
              const contactPhoneNumbers = contact.phoneNumbers.map(
                phoneNumber => phoneNumber.number
              );
              for (let phoneNumber of contactPhoneNumbers) {
                if (
                  snapshot.child(`${phoneNumber}`.replace(/\s/g, "")).exists()
                ) {
                  return snapshot.val()[phoneNumber.replace(/\s/g, "")];
                }
              }
              return;
            })
            .filter(x => x);
          return {
            ...prevState,
            contacts
          };
        });
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
        textColor={this.props.colors.textColor}
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
          borderBottomColor: this.props.colors.hairlineColor,
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
      >
        <View style={{ paddingLeft: 10 }}>
          <GroupPicture source={{ uri: item.photoURL }} value={0.1} />
        </View>
        <Field
          name={`contact${item.displayName}`}
          component={this.renderCheckBox}
          user={item}
          label={item.displayName}
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
        <ContinueButton name="arrow-forward" btnColor={this.props.colors.continueButton} />
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
          keyExtractor={item => item.uid}
        />
        {this.state.count > 0 ? this.renderButton() : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{ display: "flex", height: "100%", backgroundColor: this.props.colors.whiteBlack }}>
        {this.renderFlatList()}
        {this.state.loading && <Spinner />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    colors: state.theme.colors
  }
}

let form = reduxForm({ form: "contactList" })(ContactsList);
export default connect(
  mapStateToProps,
  { createGroup }
)(form);
