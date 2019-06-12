import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import {
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import {
  fetchedConversation,
  updateLastMessage
} from "../../../store/actions/messages";
import MyIcon from "../../../components/MyIcon";
import _ from "lodash";

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      groupID: this.props.navigation.getParam("group").groupID,
      textMessage: "",
      prevDay: new Date().getDay()
    };
    this.convertTime = this.convertTime.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.convertDate = this.convertDate.bind(this);
  }

  messagesRef = firebase.database().ref("messages");

  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: navigation.getParam("group").groupName,
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CreateEvents", {
              groupID: navigation.getParam("group").groupID
            })
          }
        >
          <MyIcon
            name="ios-add"
            size={32}
            color="white"
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
        fetchedConversation(
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
    this.refs.messageList.scrollToEnd({ animated: true });
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

  convertDate = dateObj => {
    dateObj = new Date(dateObj);
    const date = dateObj.getDate();
    let month = dateObj.getMonth();
    let hour = dateObj.getHours();
    hour = hour < 10 ? "0" + hour : hour;
    let minute = dateObj.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    let day = dateObj.getDay();
    switch (day) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        day = "No day defined";
        break;
    }
    switch (month) {
      case 0:
        month = "Jan";
        break;
      case 1:
        month = "Feb";
        break;
      case 2:
        month = "Mar";
        break;
      case 3:
        month = "Apr";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "Jun";
        break;
      case 6:
        month = "Jul";
        break;
      case 7:
        month = "Aug";
        break;
      case 8:
        month = "Sep";
        break;
      case 9:
        month = "Oct";
        break;
      case 10:
        month = "Nov";
        break;
      case 11:
        month = "Dec";
        break;
      default:
        month = "No Month Defined";
        break;
    }
    return `${day}, ${date} ${month}, ${hour}:${minute}`;
  };

  // sameDay = (dateOfMessage, message) => {
  //   console.log("props date = " + this.props.prevDate);
  //   if(dateOfMessage === this.props.prevDate){
  //     console.log("in true. day = " + dateOfMessage + ' ' + message)
  //     return true;
  //   }
  //   console.log('in false. day = ' + dateOfMessage + ' ' + message);
  //   this.props.dispatch(changePrevDate(this.state.groupID, dateOfMessage));
  //   return false;
  // }

  sendMessage = () => {
    const groupID = this.state.groupID;
    if (this.state.textMessage.length > 0) {
      const msgID = this.messagesRef.child(`${groupID}`).push().key;
      console.log(this.state);
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
      updateLastMessage(groupID, message);
      this.setState({ textMessage: "" });
    }
  };

  renderRow = ({ item }) => {
    if (item.messageType === "text") {
      return (
        <View
          style={
            item.sender === this.props.uid
              ? styles.myMessageBubble
              : styles.yourMessageBubble
          }
        >
          <View style={{ flexWrap: "wrap" }}>
            <Text style={{ color: "#fff", padding: 7, fontSize: 16 }}>
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
      );
    } else if (item.messageType === "event") {
      return (
        <View
          style={
            item.sender === this.props.uid
              ? styles.myEventBubble
              : styles.yourEventBubble
          }
        >
          <View style={styles.eventBubbleContent}>
            <View>
              <Text style={{ ...styles.eventDetails, fontWeight: "bold" }}>
                {item.event.title}
              </Text>
              <Text style={styles.eventDetails}>
                {this.convertDate(item.event.from) +
                  " to\n" +
                  this.convertDate(item.event.to)}
              </Text>
              <Text
                style={{
                  ...styles.eventDetails,
                  display: item.event.location ? "flex" : "none"
                }}
              >
                {item.event.location}
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
          <View style={styles.eventBubbleButtons}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.invitationButton}>Accept</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.invitationButton}>Reject</Text>
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
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
              <View style={styles.chatBox}>
                <TextInput
                  style={styles.chatInput}
                  value={this.state.textMessage}
                  onChangeText={this.handleChange("textMessage")}
                  placeholder="Write a message"
                />
                <TouchableOpacity onPress={this.sendMessage}>
                  <Text style={styles.sendBtn}>Send</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
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
    borderColor: "black"
  },
  sendBtn: {
    color: "#1d73d6",
    fontSize: 20
  },
  yourMessageBubble: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-start",
    backgroundColor: "#134782",
    borderRadius: 20,
    marginBottom: 8,
    paddingLeft: 5,
    marginRight: 40
  },
  myMessageBubble: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "auto",
    alignSelf: "flex-end",
    backgroundColor: "#3a8cbc",
    borderRadius: 20,
    marginBottom: 8,
    paddingLeft: 5,
    marginLeft: 40
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
    fontSize: 16,
    textDecorationLine: "underline",
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
