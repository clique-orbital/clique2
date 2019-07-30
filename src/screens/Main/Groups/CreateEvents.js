import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView
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
import { fetchAllEvents } from "../../../store/actions/calendar";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import MyIcon from "../../../components/MyIcon";

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
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "New Event",
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: navigation.getParam("headerColor"),
        borderBottomColor: "transparent"
      }
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
      await this.props.dispatch(fetchAllEvents(this.props.uid));
      this.props.navigation.goBack();
      this.props.dispatch(resetEventState());
    }
  }

  renderTitle = width => {
    return (
      <View
        style={[
          styles.border,
          {
            borderBottomColor: this.props.colors.hairlineColor,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10
          }
        ]}
      >
        <View style={{ marginHorizontal: 20 }}>
          <MyIcon name="title" type="material" color="darkgrey" size={30} />
        </View>
        <Input
          autoCapitalize="sentences"
          left
          placeholder="Add title"
          placeholderTextColor={this.props.colors.placeholderColor}
          style={[
            styles.input,
            {
              color: this.props.colors.textColor,
              fontWeight: "400"
            }
          ]}
          w={width}
          value={this.props.title}
          onChangeText={this.handleTextChange("title")}
          keyboardAppearance={this.props.colors.keyboard}
        />
      </View>
    );
  };

  renderDates = width => {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            width: width,
            paddingTop: 10,
            borderBottomColor: this.props.colors.hairlineColor
          },
          styles.border
        ]}
      >
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <MyIcon name="ios-time" size={30} color="darkgrey" />
        </View>
        <View style={{ margin: 10, marginBottom: 0 }}>
          <Text
            medium
            h3
            style={{
              paddingBottom: 10,
              height: 40,
              color: this.props.colors.textColor
            }}
          >
            From:
          </Text>
          <Text
            medium
            h3
            style={{
              paddingBottom: 10,
              height: 40,
              color: this.props.colors.textColor
            }}
          >
            To:
          </Text>
        </View>
        <View style={{ margin: 10, marginBottom: 0 }}>
          <TouchableOpacity
            style={{
              height: 40,
              paddingBottom: 10
            }}
            onPress={this.showFromDatePicker}
          >
            <Text medium h3 style={{ color: this.props.colors.textColor }}>
              {convertDate(this.props.fromDate)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 40,
              paddingBottom: 10
            }}
            onPress={this.showToDatePicker}
          >
            <Text medium h3 style={{ color: this.props.colors.textColor }}>
              {convertDate(this.props.toDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderItem = (width, item, iconName) => {
    return (
      <View
        style={[
          {
            width: width,
            flexDirection: "row",
            paddingVertical: 10,
            alignItems: "center",
            borderBottomColor: this.props.colors.hairlineColor
          },
          styles.border
        ]}
      >
        <View style={{ marginHorizontal: 20 }}>
          <MyIcon name={iconName} size={30} color="darkgrey" />
        </View>
        {item}
      </View>
    );
  };

  render() {
    const width = Dimensions.get("window").width;
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : -200}
        style={{ flex: 1, backgroundColor: this.props.colors.whiteBlack }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            {this.renderTitle(width)}
            {this.renderDates(width)}
            {this.renderItem(
              width,
              <Input
                autoCapitalize="sentences"
                left
                placeholderTextColor={this.props.colors.placeholderColor}
                placeholder="Add location"
                style={
                  ({ ...styles.input },
                    { marginLeft: 10, color: this.props.colors.textColor })
                }
                value={this.props.location}
                onChangeText={this.handleTextChange("location")}
                keyboardAppearance={this.props.colors.keyboard}
              />,
              "md-map"
            )}
            {this.renderItem(
              width,
              <Input
                autoCapitalize="sentences"
                left
                placeholder="Add notes"
                placeholderTextColor={this.props.colors.placeholderColor}
                style={
                  ({ ...styles.input },
                    { marginLeft: 10, color: this.props.colors.textColor })
                }
                value={this.props.notes}
                onChangeText={this.handleTextChange("notes")}
                keyboardAppearance={this.props.colors.keyboard}
              />,
              "md-book"
            )}
          </View>
          <View style={{ alignItems: "center" }}>
            <Button
              shadow
              style={[
                styles.publishButton,
                { backgroundColor: this.props.colors.headerColor }
              ]}
              onPress={() => this.publishEvent()}
            >
              <Text semibold white center>
                Publish
              </Text>
            </Button>
          </View>
        </SafeAreaView>

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
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const createEventsReducerState = state.createEventsReducer || {};
  return {
    title: createEventsReducerState.title,
    fromDateVisibility: createEventsReducerState.fromDateVisibility,
    toDateVisibility: createEventsReducerState.toDateVisibility,
    fromDate:
      createEventsReducerState.fromDate ||
      ownProps.navigation.getParam("date") ||
      new Date(),
    toDate:
      createEventsReducerState.toDate || 
      createEventsReducerState.fromDate || //fromDate is a feature, not a bug!
      new Date(),
    location: createEventsReducerState.location,
    notes: createEventsReducerState.notes,
    uid: state.authReducer.user.uid,
    username: state.authReducer.user.displayName,
    colors: state.theme.colors
  };
};

export default connect(mapStateToProps)(CreateEvents);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    color: cliqueBlue,
    height: 40
  },
  publishButton: {
    width: "70%",
    borderRadius: 10,
    marginTop: 10
  },
  publishText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  input: {
    borderRadius: 0,
    borderWidth: 0
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%"
  }
});
