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
  SafeAreaView,
  StatusBar
} from "react-native";
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
import { values } from "lodash";
import GroupPicture from "../../../components/GroupPicture";
import Text from "../../../components/Text";
import EventBubble from "../../../components/EventBubble";
import MessageBubble from "../../../components/MessageBubble";
import PollModal from "../../../components/PollModal";
import { fetchPersonalEvents } from "../../../store/actions/calendar";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import SystemMessageBubble from "../../../components/SystemMessageBubble";
import { getDate } from "../../../assets/constants";
import { FlatList } from "react-native-gesture-handler";
import PollMessageBubble from "../../../components/PollMessageBubble";
import { setToZero } from "../../../store/actions/messageCounter";
import ButtonsModal from "../../../components/ButtonsModal";

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      groupID: this.props.navigation.getParam("group").groupID,
      textMessage: "",
      dayOfLastMsg: new Date().getDay(),
      dateOfLastMsg: new Date().getDate(),
      numOfVisibleMsg: 40,
      isRefreshing: false,
      visible: false,
      heightOfInput: 0,
    };
    this.convertTime = this.convertTime.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showEventModal = this.showEventModal.bind(this);
    this.sendSystemMessage = this.sendSystemMessage.bind(this);
    this.increaseNumOfVisibleMsg = this.increaseNumOfVisibleMsg.bind(this);
    // this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  messagesRef = firebase.database().ref("messages");

  static navigationOptions = ({ navigation }) => {
    const group = navigation.getParam("group");
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
              group
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
            {group.groupName}
          </Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("GroupCalendar", {
              groupID: group.groupID,
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
      ),
      headerStyle: {
        borderBottomColor: "transparent"
      }
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      groupName: this.props.group.groupName
    });
    this.props.dispatch(setToZero(this.state.groupID));
    firebase
      .database()
      .ref(`groups/${this.state.groupID}`)
      .on("child_changed", snapshot => {
        this.props.dispatch(setToZero(this.state.groupID));
      });
  }

  componentWillMount() {
    const groupID = this.state.groupID;
    this.messagesRef.child(`${groupID}`).on("value", snapshot => {
      this.props.dispatch(
        fetchConversation(
          groupID,
          this.sort(values(snapshot.val())).slice(0, 40)
        )
      );
    });
  }

  componentWillUnmount() {
    this.setState({ visible: false });
  }

  // scrollToBottom = (contentHeight, contentWidth) => {
  //   this.refs.messageList.scrollToOffset({ offset: 0, animated: false });
  // };

  sort = messages => {
    return messages.sort((message1, message2) => {
      return message2.timestamp - message1.timestamp;
    });
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
    const groupID = this.state.groupID;
    if (this.state.textMessage.length > 0) {
      const lastMessage = this.props.group.last_message;
      const dateObj = new Date(lastMessage.timestamp);
      const currentDate = new Date();
      const diffDate =
        dateObj.getDate() !== currentDate.getDate() ||
        dateObj.getMonth() !== currentDate.getMonth();

      if (diffDate || lastMessage.sender === "") {
        const dateMsgID = this.messagesRef.child(`${groupID}`).push().key;
        const dateMessage = {
          messageType: "system",
          message: `${getDate(currentDate)}`,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sender: ""
        };
        this.messagesRef
          .child(`${groupID}`)
          .child(`${dateMsgID}`)
          .set(dateMessage);
      }
      const msgID = this.messagesRef.child(`${groupID}`).push().key;
      let message = {
        messageType: "text",
        message: this.state.textMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sender: this.state.uid,
        username: this.props.username,
        firstMsgBySender: lastMessage.sender !== this.props.uid
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
      // const newMsg = Object.assign({}, message);
      // newMsg.timestamp = new Date();
      // this.props.dispatch(addNewMsgToConvo(groupID, newMsg));
      this.setState({ textMessage: "" });
    }
  };

  sendSystemMessage = text => {
    const groupID = this.state.groupID;
    const msgID = this.messagesRef.child(`${groupID}`).push().key;
    const message = {
      messageType: "system",
      message: text,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      sender: ""
    };
    this.messagesRef
      .child(`${groupID}`)
      .child(`${msgID}`)
      .set(message);
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
        .ref(
          `users/${this.props.uid}/attending/${this.state.groupID}/${
          event.eventID
          }`
        )
        .set(true);
      firebase
        .database()
        .ref(
          `users/${this.props.uid}/notAttending/${this.state.groupID}/${
          event.eventID
          }`
        )
        .remove();
      this.sendSystemMessage(
        `${this.props.username} is attending ${event.title}!`
      );
      this.props.dispatch(fetchPersonalEvents(this.props.uid));
    } else {
      updatedEvent = {
        ...event,
        attending,
        noResponse,
        notAttending: [...notAttending, this.props.uid]
      };
      firebase
        .database()
        .ref(
          `users/${this.props.uid}/notAttending/${this.state.groupID}/${
          event.eventID
          }`
        )
        .set(true);
      firebase
        .database()
        .ref(
          `users/${this.props.uid}/attending/${this.state.groupID}/${
          event.eventID
          }`
        )
        .remove();
      this.sendSystemMessage(
        `${this.props.username} is not attending ${event.title}!`
      );
      this.props.dispatch(fetchPersonalEvents(this.props.uid));
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
  };

  renderRow = ({ item }) => {
    if (item.messageType === "text") {
      return (
        <MessageBubble
          style={[
            { flexDirection: "column" },
            item.sender === this.props.uid
              ? [
                styles.myMessageBubble,
                { backgroundColor: this.props.colors.myMsgBubble }
              ]
              : [
                styles.yourMessageBubble,
                { backgroundColor: this.props.colors.yourMsgBubble }
              ]
          ]}
          uid={this.props.uid}
          convertTime={this.convertTime}
          item={item}
          maxWidth={Dimensions.get("window").width}
          mine={item.sender === this.props.uid}
          textColor={this.props.colors.textColor}
          usernameColor={this.props.colors.chatUsername}
        />
      );
    } else if (item.messageType === "event") {
      const eventID = item.event.eventID;
      return (
        <EventBubble
          style={
            item.sender === this.props.uid
              ? {
                ...styles.myEventBubble,
                backgroundColor: this.props.colors.myMsgBubble
              }
              : {
                ...styles.yourEventBubble,
                backgroundColor: this.props.colors.yourMsgBubble
              }
          }
          showEventModal={this.showEventModal}
          uid={this.props.uid}
          convertTime={this.convertTime}
          respondToInvitation={this.respondToInvitation}
          eventID={eventID}
          item={item}
          convertDate={convertDate}
          textColor={this.props.colors.textColor}
        />
      );
    } else if (item.messageType === "system") {
      return (
        <SystemMessageBubble
          message={item.message}
          color={this.props.colors.systemMsgBubble}
        />
      );
    } else if (item.messageType === "poll") {
      return <PollMessageBubble poll={item.pollObject} />;
    }
  };

  renderFooter = () => {
    return <View style={{ height: 10 }} />;
  };

  increaseNumOfVisibleMsg = () => {
    console.log("refreshing");
    const { groupID, numOfVisibleMsg } = this.state;
    this.setState({ numOfVisibleMsg: numOfVisibleMsg + 40 }
      , () => {
        this.messagesRef.child(`${groupID}`).once("value", snapshot => {
          this.props.dispatch(
            fetchConversation(groupID, (this.sort(values(snapshot.val()))).slice(0, this.state.numOfVisibleMsg))
          );
        });
      })
  }

  render() {
    let height = Dimensions.get("window").height;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: this.props.colors.lightMain }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {Platform.OS === "ios" ? (
              <FlatList
                onEndReachedThreshold={0}
                onEndReached={this.increaseNumOfVisibleMsg}
                ref="messageList"
                style={{
                  padding: 10,
                  height: height,
                  backgroundColor: this.props.colors.chatBackground
                }}
                data={this.props.conversation}
                renderItem={this.renderRow}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this.renderFooter}
                initialNumToRender={50}
                inverted
                extraData={this.state.numOfVisibleMsg}
              />
            ) : (
                <KeyboardAwareFlatList
                  onEndReachedThreshold={0}
                  onEndReached={this.increaseNumOfVisibleMsg}
                  ref="messageList"
                  style={{
                    padding: 10,
                    height: height,
                    backgroundColor: this.props.colors.chatBackground
                  }}
                  data={this.props.conversation}
                  renderItem={this.renderRow}
                  ListFooterComponent={this.renderFooter}
                  inverted
                  keyExtractor={(item, index) => index.toString()}
                  initialNumToRender={50}
                  extraData={this.state.numOfVisibleMsg}
                />
              )}
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 87 : -200}
            style={{
              flexDirection: "row",
              zIndex: 1,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: "lightgrey",
              bottom: 0,
              backgroundColor: this.props.colors.lightMain,
              borderTopColor: "transparent",
              paddingHorizontal: 5
            }}
          >
            <TouchableOpacity
              onPress={
                () => this.setState({ visible: true })
                // this.props.navigation.navigate("CreatePoll", {
                //   groupID: this.state.groupID,
                //   uid: this.props.uid,
                //   username: this.props.username
                // })
              }
              style={{ justifyContent: "center" }}
            >
              <MyIcon
                name="add"
                type="material"
                size={28}
                color={this.props.colors.chatButtons}
              />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", flex: 1, }}
              onLayout={event => {
                const { height } = event.nativeEvent.layout;
                this.setState({ heightOfInput: height });
              }}
            >
              <TextInput
                autoCapitalize="sentences"
                style={[styles.chatInput, { color: this.props.colors.textColor }]}
                value={this.state.textMessage}
                onChangeText={this.handleChange("textMessage")}
                placeholder="Message"
                placeholderTextColor={this.props.colors.placeholderColor}
                keyboardAppearance={this.props.colors.keyboard}
              />
              <TouchableOpacity
                onPress={this.sendMessage}
                style={{ justifyContent: "center", marginRight: 5 }}
              >
                <MyIcon
                  name="send"
                  type="material"
                  size={28}
                  color={this.props.colors.chatButtons}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <EventModal />
          <ButtonsModal
            visible={this.state.visible}
            setFalse={() => this.setState({ visible: false })}
            groupID={this.state.groupID}
            uid={this.props.uid}
            username={this.props.username}
            navigation={this.props.navigation}
            theme={this.props.colors}
            heightOfInput={this.state.heightOfInput}
          />
          <PollModal group={this.props.group} />
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { groupID } = ownProps.navigation.getParam("group");
  const stateOfGroup = state.messagesReducer[groupID] || {};
  const username = (state.authReducer.user || {}).displayName;
  return {
    uid: (state.authReducer.user || {}).uid,
    conversation: stateOfGroup.messages || [],
    username,
    group: state.groupsReducer.groups[groupID],
    colors: state.theme.colors
  };
};

export default connect(mapStateToProps)(ChatScreen);

const styles = StyleSheet.create({
  inner: {
    justifyContent: "flex-end"
  },
  chatBox: {
    // alignItems: "center"
  },
  chatInput: {
    flex: 1,
    padding: 10,
    color: "black",
    bottom: 0,
    fontSize: 16,
    backgroundColor: "transparent",
    borderTopColor: "transparent"
  },
  yourMessageBubble: {
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-start",
    borderRadius: 10,
    marginBottom: 2,
    paddingLeft: 5,
    maxWidth: "100%",
    marginRight: 80
  },
  myMessageBubble: {
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-end",
    borderRadius: 10,
    marginBottom: 2,
    paddingLeft: 5,
    marginLeft: 80,
    maxWidth: "100%"
  },
  yourEventBubble: {
    alignSelf: "flex-start",
    borderRadius: 20,
    marginBottom: 5,
    width: "auto",
    marginRight: 40
  },
  myEventBubble: {
    alignSelf: "flex-end",
    borderRadius: 20,
    marginBottom: 5,
    width: "auto",
    marginLeft: 50
  }
});
