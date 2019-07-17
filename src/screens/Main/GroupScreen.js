import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
  StatusBar
} from "react-native";
import firebase from "react-native-firebase";
import _ from "lodash";
import HeaderTitle from "../../components/HeaderTitle";
import MyIcon from "../../components/MyIcon";
import {
  fetchedGroups,
  fetchAGroup,
  sortGroups,
  fetchGroups,
  deleteGroupFromDb
} from "../../store/actions/groups";
import { connect } from "react-redux";
import GroupPicture from "../../components/GroupPicture";
import SwipeOut from "react-native-swipeout";
import { incrementCount, setToZero } from "../../store/actions/messageCounter";
import Text from "../../components/Text";

const cliqueBlue = "#134782";

class GroupScreen extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      headerTitle: <HeaderTitle title="Groups" />,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate("CreateGroups", {
          headerColor: (navigation.state.params || {}).backgroundColor || cliqueBlue,
        })}>
          <MyIcon
            name="ios-add"
            size={32}
            color="white"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        borderBottomColor: "transparent",
      },
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      backgroundColor: this.props.colors.headerColor,
    })
    this.scrollToTop();
    const db = firebase.database();
    const uid = firebase.auth().currentUser.uid;

    db.ref(`users/${uid}/groups`).on("value", () => {
      this.props.fetchGroups();
    });

    if (this.props.groups) {
      for (let groupId of _.keys(this.props.groups)) {
        db.ref(`groups/${groupId}`).on(
          "child_changed",
          snapshot => {
            if (snapshot.val().username !== firebase.auth().currentUser.displayName) {
              this.props.incrementCount(groupId);
            }
            this.fetchGroup(groupId).then(() => {
              this.props.sortGroups();
            });
          }
        );
      }
    }
  }

  fetchGroup = groupId => {
    return firebase
      .database()
      .ref(`groups/${groupId}/last_message`)
      .once("value", snapshot => {
        this.props.fetchAGroup(groupId, snapshot.val());
      });
  };

  renderLastMessage = groupId => {
    const group = this.props.groups[groupId];

    const messageType = (group.last_message || {}).messageType;
    let username;
    if (group.last_message.sender === firebase.auth().currentUser.uid) {
      username = "You";
    } else {
      username = (group.last_message || {}).username;
    }

    if (messageType === "text") {
      const message = (group.last_message || {}).message;
      return (
        <Text header style={{ color: "#989898", top: 5 }} numberOfLines={1}>
          <Text style={{ color: this.props.colors.lastMsgUsername, fontWeight: "400" }}>
            {username}
          </Text>
          {username ? ": " : ""}
          {message}
        </Text>
      );
    } else if (messageType === "system") {
      const message = (group.last_message || {}).message;
      return (
        <Text header style={{ top: 5, color: "#989898" }} numberOfLines={1}>
          {message}
        </Text>
      );
    } else if (messageType === "event") {
      const eventTitle = (group.last_message || {}).event.title;
      return (
        <Text header style={{ top: 5, color: "#989898" }} numberOfLines={1}>
          <Text medium header style={{ color: this.props.colors.lastMsgUsername, fontWeight: "400" }}>
            {username + " "}
          </Text>
          created a new event: {eventTitle}
        </Text>
      );
    } else if (messageType === "poll") {
      const pollQuestion = group.last_message.pollObject.question;
      return (
        <Text header style={{ top: 5, color: "#989898" }} numberOfLines={1}>
          <Text medium header style={{ color: this.props.colors.lastMsgUsername, fontWeight: "400" }}>
            {username + " "}
          </Text>
          created a new poll: {pollQuestion}
        </Text>
      );
    }
  };

  renderTimestamp = groupId => {
    const timestamp = (this.props.groups[groupId].last_message || {}).timestamp;
    const time = new Date(timestamp);
    let hours = time.getHours() + "";
    let minutes = time.getMinutes() + "";
    minutes = minutes.padStart(2, "0");
    hours = hours.padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  renderRow = ({ item }) => {
    item = item || {};
    const swipeSettings = {
      autoClose: true,
      right: [
        {
          onPress: () => {
            Alert.alert(
              "Delete Group",
              "Are you sure you want to delete this group permanently?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Delete"),
                  style: "cancel"
                },
                {
                  text: "Yes",
                  onPress: () => {
                    console.log("deleting");
                    this.props.deleteGroupFromDb(item.groupID, item.users);
                  }
                },
                { cancelable: true }
              ]
            );
          },
          text: "Delete",
          type: "delete"
        }
      ],
      rowId: item.id,
      backgroundColor: "#fff"
    };
    const height = Dimensions.get("window").width * 0.14;
    return (
      <SwipeOut {...swipeSettings}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity
          activeOpacity={this.props.colors.touchOpacity}
          style={[styles.chatList, { backgroundColor: this.props.colors.whiteBlack, borderColor: this.props.colors.hairlineColor, }]}
          onPress={() =>
            this.props.navigation.navigate("Chat", {
              group: item,
              image: { uri: item.photoURL },
              groupID: item.groupID,
            })
          }
        >
          <View style={{ flexDirection: "row" }}>
            <GroupPicture
              cached={true}
              source={{ uri: item.photoURL }}
              value={0.14}
            />
            <View style={{ height, left: 15, justifyContent: "space-between" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: Dimensions.get("window").width * 0.75
                }}
              >
                <Text h3 semibold color={this.props.colors.textColor}>
                  {item.groupName}
                </Text>
                <Text color={this.props.colors.textColor}>{this.renderTimestamp(item.groupID)}</Text>
              </View>
              <View style={{ padding: 2, marginBottom: 10, width: "90%" }}>
                {this.renderLastMessage(item.groupID)}
              </View>
            </View>
            <View>
              {this.props.groupsMessageCounter[item.groupID] > 0 ? (
                <View
                  style={{
                    backgroundColor: "#3a8cbc",
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    position: "absolute",
                    right: 10,
                    bottom: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text white center size={10}>{this.props.groupsMessageCounter[item.groupID]}</Text>
                </View>
              ) : (
                  undefined
                )}
            </View>
          </View>
        </TouchableOpacity>
      </SwipeOut >
    );
  };

  scrollToTop = () => {
    this.refs.groupList.scrollToOffset({ animated: false, offset: 0 });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1, backgroundColor: this.props.colors.whiteBlack }}
          ref="groupList"
          onContentSizeChange={this.scrollToTop}
          data={Object.values(this.props.groups)}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatList: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
});

const mapStateToProps = state => {
  return {
    groups: state.groupsReducer.groups,
    groupsMessageCounter: state.messageCounterReducer.groups,
    colors: state.theme.colors
  };
};

export default connect(
  mapStateToProps,
  {
    fetchAGroup,
    fetchedGroups,
    sortGroups,
    fetchGroups,
    incrementCount,
    setToZero,
    deleteGroupFromDb
  }
)(GroupScreen);
