import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  toggleEventModal,
  populateAttending,
  populateNotAttending
} from "../../../store/actions/eventModal";
import { connect } from "react-redux";
import { fetchConversation } from "../../../store/actions/messages";
import { convertDate } from "../../../assets/constants";
import firebase from "react-native-firebase";
import MyIcon from "../../../components/MyIcon";
import EventModal from "../EventModal";
import _ from "lodash";
import GroupPicture from "../../../components/GroupPicture";
import Text from "../../../components/Text";

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      groupID: this.props.navigation.getParam("group").groupID,
      textMessage: "",
      dayOfLastMsg: new Date().getDay(),
      dateOfLastMsg: new Date().getDate()
    };
    this.convertTime = this.convertTime.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showEventModal = this.showEventModal.bind(this);
    this.sameDay = this.sameDay.bind(this);
  }

  messagesRef = firebase.database().ref("messages");

  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <View style={{ flexDirection: "row" }}>
          <GroupPicture source={navigation.getParam("image")} value={0.1} />
          <Text
            style={{
              color: "#fff",
              paddingLeft: 15,
              fontSize: 18,
              fontWeight: "500",
              textAlignVertical: "center"
            }}
          >
            {navigation.getParam("group").groupName}
          </Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("GroupCalendar", {
              groupID: navigation.getParam("group").groupID,
              title: "Group Calendar"
            })
          }
        >
          <MyIcon
            name="calendar"
            size={32}
            color="white"
            type="material-community"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      )
    };
  };

  componentWillMount() {
    const groupID = this.state.groupID;
    this.messagesRef.child(`${groupID}`).on("value", snapshot => {
      this.props.dispatch(
        fetchConversation(
          groupID,
          _.sortBy(_.values(snapshot.val()), "timestamp")
        )
      );
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.scrollToBottom
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.scrollToBottom
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  scrollToBottom = (contentHeight, contentWidth) => {
    this.refs.messageList.scrollToEnd({ animated: false });
  };

  handleChange = key => val => {
    this.setState({
      [key]: val
    });
  };

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? 0 : "") + d.getHours() + ":";
    result += (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return result;
  };

  sendMessage = () => {
    console.log("Sending Message");
    const groupID = this.state.groupID;
    if (this.state.textMessage.length > 0) {
      const msgID = this.messagesRef.child(`${groupID}`).push().key;
      let message = {
        messageType: "text",
        message: this.state.textMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sender: this.state.uid,
        username: this.props.username
      };
      this.messagesRef
        .child(`${groupID}`)
        .child(`${msgID}`)
        .set(message);
      firebase
        .database()
        .ref(`groups/${groupID}`)
        .child("last_message")
        .set(message);
      this.setState({ textMessage: "" });
    }
  };

  respondToInvitation = (eventID, response) => async () => {
    const eventSnapshot = await firebase
      .database()
      .ref(`events/${this.state.groupID}/${eventID}`)
      .once("value");
    const event = eventSnapshot.val();
    const attending = (event.attending || []).filter(
      uid => uid !== this.props.uid
    );
    const notAttending = (event.notAttending || []).filter(
      uid => uid !== this.props.uid
    );
    const noResponse = (event.noResponse || []).filter(
      uid => uid !== this.props.uid
    );
    let updatedEvent;
    if (response) {
      updatedEvent = {
        ...event,
        attending: [...attending, this.props.uid],
        notAttending,
        noResponse
      };
    } else {
      updatedEvent = {
        ...event,
        attending,
        noResponse,
        notAttending: [...notAttending, this.props.uid]
      };
    }
    firebase
      .database()
      .ref(`events/${this.state.groupID}/${eventID}`)
      .set(updatedEvent);

    // Updates event in message the event is attached to
    const msgID = updatedEvent.msgID;
    firebase
      .database()
      .ref(`messages/${this.state.groupID}/${msgID}/event`)
      .set(updatedEvent);
  };

  /*
  Fetches Event data and display names of all uid, and stored in state for event modal to use
  */
  showEventModal = event => async () => {
    let attending = event.attending || [];
    let notAttending = event.notAttending || [];
    attending = await attending.map(async uid => {
      const nameSnapshot = await firebase
        .database()
        .ref(`users/${uid}/displayName`)
        .once("value");
      return nameSnapshot.val();
    });

    Promise.all(attending).then(members => {
      this.props.dispatch(populateAttending(members));
    });

    notAttending = await notAttending.map(async uid => {
      const nameSnapshot = await firebase
        .database()
        .ref(`users/${uid}/displayName`)
        .once("value");
      return nameSnapshot.val();
    });

    Promise.all(notAttending).then(members => {
      this.props.dispatch(populateNotAttending(members));
    });

    this.props.dispatch(toggleEventModal(true, event));
  };

  sameDay = (dateOfLastMsg, dayOfLastMsg) => {
    console.log("props date = " + this.props.prevDate);
    if (
      dateOfLastMsg === this.state.dateOfLastMsg &&
      dayOfLastMsg === this.state.dayOfLastMsg
    ) {
      console.log("in true. " + `${dateOfLastMsg}/${dayOfLastMsg}`);
      return true;
    }
    console.log("in false. " + `${dateOfLastMsg}/${dayOfLastMsg}`);
    this.setState({
      dateOfLastMsg,
      dayOfLastMsg
    });
    return false;
  };

  renderRow = ({ item }) => {
    if (item.messageType === "text") {
      return (
        <View
          style={[
            { flexDirection: "column" },
            item.sender === this.props.uid
              ? styles.myMessageBubble
              : styles.yourMessageBubble
          ]}
        >
          {item.sender !== this.props.uid && (
            <View style={{ padding: 2 }}>
              <Text white semibold>
                {item.username}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexWrap: "wrap" }}>
              <Text body white style={{ padding: 7 }}>
                {item.message}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text
                style={{
                  color: "#eee",
                  paddingRight: 13,
                  paddingBottom: 7,
                  fontSize: 10
                }}
              >
                {this.convertTime(item.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (item.messageType === "event") {
      const eventID = item.event.eventID;
      return (
        <View
          style={
            item.sender === this.props.uid
              ? styles.myEventBubble
              : styles.yourEventBubble
          }
        >
          <TouchableOpacity
            style={styles.eventBubbleContent}
            onPress={this.showEventModal(item.event)}
          >
            <View>
              <Text semibold h2 style={{ ...styles.eventDetails }}>
                {item.event.title}
              </Text>
              <Text light body style={styles.eventDetails}>
                {convertDate(item.event.from) +
                  " to\n" +
                  convertDate(item.event.to)}
              </Text>
              <Text
                light
                body
                style={{
                  ...styles.eventDetails,
                  display: item.event.location ? "flex" : "none"
                }}
              >
                Location: {item.event.location}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text
                style={{
                  color: "#eee",
                  paddingRight: 13,
                  paddingBottom: 7,
                  fontSize: 10
                }}
              >
                {this.convertTime(item.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.eventBubbleButtons}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={this.respondToInvitation(eventID, true)}
                disabled={(item.event.attending || []).includes(this.props.uid)}
              >
                <Text style={styles.invitationButton}>
                  {(item.event.attending || []).includes(this.props.uid)
                    ? "Accepted!"
                    : "Accept"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={this.respondToInvitation(eventID, false)}
                disabled={(item.event.notAttending || []).includes(
                  this.props.uid
                )}
              >
                <Text style={styles.invitationButton}>
                  {(item.event.notAttending || []).includes(this.props.uid)
                    ? "Rejected!"
                    : "Reject"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  render() {
    let { height } = Dimensions.get("window");
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : -300}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <FlatList
                ref="messageList"
                onContentSizeChange={this.scrollToBottom}
                style={{ padding: 10, height: height * 0.8 }}
                data={this.props.conversation.slice()}
                renderItem={this.renderRow}
                keyExtractor={(item, index) => index.toString()}
              />
              <View style={[styles.chatBox, { zIndex: 1 }]}>
                <TextInput
                  style={styles.chatInput}
                  value={this.state.textMessage}
                  onChangeText={this.handleChange("textMessage")}
                  placeholder="Write a message"
                />
                <TouchableOpacity onPress={this.sendMessage} style={{}}>
                  <Text style={styles.sendBtn}>Send</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
        <EventModal groupID={this.state.groupID} />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { groupID } = ownProps.navigation.getParam("group");
  const stateOfGroup = state.messagesReducer[groupID] || {};
  const username = state.authReducer.user.displayName;
  return {
    uid: state.authReducer.user.uid,
    conversation: stateOfGroup.messages || [],
    username
  };
};

export default connect(mapStateToProps)(ChatScreen);

const styles = StyleSheet.create({
  inner: {
    justifyContent: "flex-end"
  },
  chatBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  chatInput: {
    borderWidth: 1,
    borderRadius: 7,
    width: "80%",
    padding: 10,
    margin: 8,
    color: "black",
    borderColor: "black",
    bottom: 0
  },
  sendBtn: {
    color: "#1d73d6",
    fontSize: 20
  },
  yourMessageBubble: {
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-start",
    backgroundColor: "#134782",
    borderRadius: 10,
    marginBottom: 8,
    paddingLeft: 5,
    maxWidth: "80%"
  },
  myMessageBubble: {
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-end",
    backgroundColor: "#3a8cbc",
    borderRadius: 10,
    marginBottom: 8,
    paddingLeft: 5,
    marginLeft: 40,
    maxWidth: "80%"
  },
  yourEventBubble: {
    alignSelf: "flex-start",
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: "#134782",
    width: "auto",
    marginRight: 40
  },
  myEventBubble: {
    alignSelf: "flex-end",
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: "#3a8cbc",
    width: "auto",
    marginLeft: 50
  },
  invitationButton: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  eventDetails: {
    color: "#fff",
    padding: 7,
    flex: 1
  },
  eventBubbleContent: {
    flexWrap: "nowrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5
  },
  eventBubbleButtons: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  acceptButton: {
    backgroundColor: "#2cb768",
    height: 40,
    justifyContent: "center",
    borderBottomLeftRadius: 20
  },
  rejectButton: {
    backgroundColor: "#c13f3f",
    height: 40,
    justifyContent: "center",
    borderBottomRightRadius: 20
  }
});
