import React, { Component } from "react";
import {
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  toggleEventModal,
  populateAttending,
  populateNotAttending
} from "../../../store/actions/eventModal";
import { connect } from "react-redux";
import { fetchConversation } from "../../../store/actions/messages";
import { convertDate, cliqueBlue } from "../../../assets/constants";
import firebase from "react-native-firebase";
import MyIcon from "../../../components/MyIcon";
import EventModal from "../EventModal";
import { sortBy, values } from "lodash";
import GroupPicture from "../../../components/GroupPicture";
import Text from "../../../components/Text";
import EventBubble from "../../../components/EventBubble";
import MessageBubble from "../../../components/MessageBubble";
import theme from "../../../assets/theme";
import { fetchPersonalEvents } from "../../../store/actions/calendar";

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
    // this.sameDay = this.sameDay.bind(this);
  }

  messagesRef = firebase.database().ref("messages");

  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: "5%"
          }}
          onPress={() =>
            navigation.navigate("GroupInformation", {
              group: navigation.getParam("group")
            })
          }
        >
          <GroupPicture
            cached
            source={navigation.getParam("image")}
            value={0.1}
          />
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
        </TouchableOpacity>
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
            size={27}
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
        fetchConversation(groupID, sortBy(values(snapshot.val()), "timestamp"))
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
      firebase
        .database()
        .ref(`users/${this.props.uid}/attending/${this.state.groupID}/${event.eventID}`)
        .set(true)
      firebase
        .database()
        .ref(`users/${this.props.uid}/notAttending/${this.state.groupID}/${event.eventID}`)
        .remove()
      this.props.dispatch(fetchPersonalEvents(this.props.uid))
    } else {
      updatedEvent = {
        ...event,
        attending,
        noResponse,
        notAttending: [...notAttending, this.props.uid]
      };
      firebase
        .database()
        .ref(`users/${this.props.uid}/notAttending/${this.state.groupID}/${event.eventID}`)
        .set(true)
      firebase
        .database()
        .ref(`users/${this.props.uid}/attending/${this.state.groupID}/${event.eventID}`)
        .remove()
      this.props.dispatch(fetchPersonalEvents(this.props.uid))
    }
    firebase
      .database()
      .ref(`events/${this.state.groupID}/${eventID}`)
      .set(updatedEvent);

    // Updates event chat message the event is attached to
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
    // this.props.navigation.navigate("EventModal", {
    //   modalVisibility: true
    // });
  };

  // sameDay = (dateOfLastMsg, dayOfLastMsg) => {
  //   console.log("props date = " + this.props.prevDate);
  //   if (
  //     dateOfLastMsg === this.state.dateOfLastMsg &&
  //     dayOfLastMsg === this.state.dayOfLastMsg
  //   ) {
  //     console.log("in true. " + `${dateOfLastMsg}/${dayOfLastMsg}`);
  //     return true;
  //   }
  //   console.log("in false. " + `${dateOfLastMsg}/${dayOfLastMsg}`);
  //   this.setState({
  //     dateOfLastMsg,
  //     dayOfLastMsg
  //   });
  //   return false;
  // };

  renderRow = ({ item }) => {
    if (item.messageType === "text") {
      return (
        <MessageBubble
          style={[
            { flexDirection: "column" },
            item.sender === this.props.uid
              ? styles.myMessageBubble
              : styles.yourMessageBubble
          ]}
          uid={this.props.uid}
          convertTime={this.convertTime}
          item={item}
          maxWidth={Dimensions.get("window").width}
          mine={item.sender === this.props.uid}
        />
      );
    } else if (item.messageType === "event") {
      const eventID = item.event.eventID;
      return (
        <EventBubble
          style={
            item.sender === this.props.uid
              ? styles.myEventBubble
              : styles.yourEventBubble
          }
          showEventModal={this.showEventModal}
          uid={this.props.uid}
          convertTime={this.convertTime}
          respondToInvitation={this.respondToInvitation}
          eventID={eventID}
          item={item}
          convertDate={convertDate}
        />
      );
    }
  };

  renderFooter = () => {
    return (
      <View style={{ height: 10 }}></View>
    )
  }

  render() {
    let height = Dimensions.get("window").height;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 87 : -300}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <FlatList
              ref="messageList"
              onContentSizeChange={this.scrollToBottom}
              style={{
                padding: 10,
                height: height,
                backgroundColor: theme.colors.light_chat_background
              }}
              data={this.props.conversation.slice()}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={this.renderFooter}
            />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.chatBox,
              {
                zIndex: 1,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: "lightgrey",
                bottom: 0,
                backgroundColor: "white"
              }
            ]}
          >
            <TextInput
              style={styles.chatInput}
              value={this.state.textMessage}
              onChangeText={this.handleChange("textMessage")}
              placeholder="Message"
            />
            <TouchableOpacity
              onPress={this.sendMessage}
              style={{ justifyContent: "center" }}
            >
              <MyIcon
                name="send"
                type="material"
                size={28}
                color={cliqueBlue}
              />
            </TouchableOpacity>
          </View>
          <EventModal groupID={this.state.groupID} />
        </SafeAreaView>
      </KeyboardAvoidingView >
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
    flexDirection: "row"
    // alignItems: "center"
  },
  chatInput: {
    width: "90%",
    padding: 10,
    color: "black",
    bottom: 0,
    fontSize: 16,
    backgroundColor: 'transparent'
  },
  yourMessageBubble: {
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.light_chat_yours,
    borderRadius: 10,
    marginBottom: 8,
    paddingLeft: 5,
    maxWidth: "100%",
    marginRight: 80
  },
  myMessageBubble: {
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-end",
    backgroundColor: theme.colors.light_chat_mine,
    borderRadius: 10,
    marginBottom: 8,
    paddingLeft: 5,
    marginLeft: 80,
    maxWidth: "100%"
  },
  yourEventBubble: {
    alignSelf: "flex-start",
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: theme.colors.light_chat_yours,
    width: "auto",
    marginRight: 40
  },
  myEventBubble: {
    alignSelf: "flex-end",
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: theme.colors.light_chat_mine,
    width: "auto",
    marginLeft: 50
  }
});
