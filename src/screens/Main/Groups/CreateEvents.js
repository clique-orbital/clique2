import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { cliqueBlue } from "../../../assets/constants";
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import {
  changeText,
  toggleFromDatePicker,
  toggleToDatePicker,
  pickFromDate,
  pickToDate,
  setGroupID,
  resetEventState
} from "../../../store/actions/createEvents";
import firebase from "react-native-firebase";
import _ from "lodash";
import { convertDate } from "../../../assets/constants";

class CreateEvents extends Component {
  constructor(props) {
    super(props);
    this.showFromDatePicker = this.showFromDatePicker.bind(this);
    this.hideFromDatePicker = this.hideFromDatePicker.bind(this);
    this.showToDatePicker = this.showToDatePicker.bind(this);
    this.hideToDatePicker = this.hideToDatePicker.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.publishEvent = this.publishEvent.bind(this);
    this.props.dispatch(setGroupID(this.props.navigation.getParam("groupID")));
    this.props.dispatch(pickFromDate(this.props.navigation.getParam("date")));
    this.props.dispatch(pickToDate(this.props.navigation.getParam("date")));
  }

  static navigationOptions = () => {
    return {
      title: "Create Event",
      headerTintColor: "#fff"
    };
  };

  handleTextChange = key => {
    return text => {
      return this.props.dispatch(changeText(key, text));
    };
  };

  showFromDatePicker() {
    console.log("Inside showFromDatePicker");
    this.props.dispatch(toggleFromDatePicker(true));
  }

  showToDatePicker() {
    console.log("Inside showFromDatePicker");
    this.props.dispatch(toggleToDatePicker(true));
  }

  hideFromDatePicker() {
    this.props.dispatch(toggleFromDatePicker(false));
  }

  hideToDatePicker() {
    this.props.dispatch(toggleToDatePicker(false));
  }

  handleFromDatePicked = date => {
    this.props.dispatch(pickFromDate(date));
    this.hideFromDatePicker();
  };

  handleToDatePicked = date => {
    this.props.dispatch(pickToDate(date));
    this.hideToDatePicker();
  };

  async publishEvent() {
    const title = this.props.title;
    if (title !== "") {
      const groupID = this.props.navigation.getParam("groupID");
      let eventID = firebase
        .database()
        .ref("events")
        .child(`${groupID}`)
        .push().key;
      const msgID = firebase
        .database()
        .ref("messages")
        .child(`${groupID}`)
        .push().key;
      let groupSnapShot = await firebase
        .database()
        .ref("groups")
        .child(`${groupID}`)
        .once("value");
      console.log(groupSnapShot.val());
      const members = _.keys(groupSnapShot.val().users);
      const event = {
        title,
        eventID,
        msgID,
        from: this.props.fromDate,
        to: this.props.toDate,
        location: this.props.location,
        notes: this.props.notes,
        attending: [],
        notAttending: [],
        noResponse: [...members],
        groupID
      };
      firebase
        .database()
        .ref("events")
        .child(`${groupID}/${eventID}`)
        .set(event);
      const message = {
        messageType: "event",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sender: this.props.uid,
        event,
        username: this.props.username
      };

      firebase
        .database()
        .ref("messages")
        .child(`${groupID}`)
        .child(`${msgID}`)
        .set(message);
      firebase
        .database()
        .ref(`groups/${groupID}`)
        .child("last_message")
        .set(message);
      this.props.dispatch(resetEventState());
      this.props.navigation.goBack();
    }
  }

  render() {
    const { height, width } = Dimensions.get("window");

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : -200}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={styles.textInputView}>
              <TextInput
                placeholder="Title"
                style={{ ...styles.textInput, width: width }}
                value={this.props.title}
                onChangeText={this.handleTextChange("title")}
              />
            </View>
            <View style={styles.textInputView}>
              <TouchableOpacity
                style={{
                  width: width,
                  height: 40,
                  justifyContent: "center",
                  paddingBottom: 10
                }}
                onPress={this.showFromDatePicker}
              >
                <Text style={styles.date}>
                  From: {convertDate(this.props.fromDate)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInputView}>
              <TouchableOpacity
                style={{
                  width: width,
                  height: 40,
                  justifyContent: "center",
                  paddingBottom: 10
                }}
                onPress={this.showToDatePicker}
              >
                <Text style={styles.date}>
                  To: {convertDate(this.props.toDate)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInputView}>
              <TextInput
                placeholder="Location"
                style={{ ...styles.textInput, width: width }}
                value={this.props.location}
                onChangeText={this.handleTextChange("location")}
              />
            </View>
            <View style={styles.textInputView}>
              <TextInput
                placeholder="Notes"
                style={{ ...styles.textInput, width: width }}
                value={this.props.notes}
                onChangeText={this.handleTextChange("notes")}
              />
            </View>
          </View>
        </ScrollView>
        <DateTimePicker
          isVisible={this.props.fromDateVisibility}
          onConfirm={this.handleFromDatePicked}
          onCancel={this.hideFromDatePicker}
          mode="datetime"
          date={this.props.fromDate}
        />
        <DateTimePicker
          isVisible={this.props.toDateVisibility}
          onConfirm={this.handleToDatePicked}
          onCancel={this.hideToDatePicker}
          mode="datetime"
          date={this.props.toDate}
        />
        <TouchableOpacity
          style={styles.publishButton}
          onPress={() => this.publishEvent()}
        >
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  const createEventsReducerState = state.createEventsReducer || {};
  return {
    title: createEventsReducerState.title,
    fromDateVisibility: createEventsReducerState.fromDateVisibility,
    toDateVisibility: createEventsReducerState.toDateVisibility,
    fromDate: createEventsReducerState.fromDate || new Date(),
    toDate: createEventsReducerState.toDate || new Date(),
    location: createEventsReducerState.location,
    notes: createEventsReducerState.notes,
    uid: state.authReducer.user.uid,
    username: state.authReducer.user.displayName
  };
};

export default connect(mapStateToProps)(CreateEvents);

const styles = StyleSheet.create({
  date: {
    fontSize: 20,
    color: "grey"
  },
  container: {
    flex: 1
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    color: cliqueBlue,
    height: 40
  },
  textInputView: {
    height: 45,
    margin: 20,
    borderBottomWidth: 2,
    borderColor: cliqueBlue
  },
  publishButton: {
    backgroundColor: cliqueBlue,
    height: 50,
    marginBottom: 30,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  publishText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  }
});
