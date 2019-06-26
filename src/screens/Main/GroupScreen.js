import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert
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
        <TouchableOpacity onPress={() => navigation.navigate("CreateGroups")}>
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

  async componentDidMount() {
    this.scrollToTop();
    const db = firebase.database();
    const uid = firebase.auth().currentUser.uid;

    db.ref(`users/${uid}/groups`).on("value", () => this.props.fetchGroups());

    if (this.props.groups) {
      for (let groupId of _.keys(this.props.groups)) {
        db.ref(`groups/${groupId}/last_message`).on(
          "child_changed",
          snapshot => {
            db.ref(`groups/${groupId}/last_message/username`)
              .once("value")
              .then(res => {
                if (res.val() !== firebase.auth().currentUser.displayName) {
                  this.props.incrementCount(groupId);
                }
              });
            this.fetchGroup(groupId).then(() => this.props.sortGroups());
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
    const groups = this.props.groups;

    const isText = (groups[groupId].last_message || {}).messageType === "text";
    const username = (groups[groupId].last_message || {}).username;

    if (isText) {
      const message = (groups[groupId].last_message || {}).message;
      return (
        <Text header style={{ top: 5 }} numberOfLines={1}>
          <Text style={{ color: cliqueBlue, fontWeight: "400" }}>
            {username}
          </Text>
          {username ? ": " : ""}
          {message}
        </Text>
      );
    } else {
      const eventTitle = (groups[groupId].last_message || {}).event.title;
      return (
        <Text header style={{ top: 5 }} numberOfLines={1}>
          <Text medium header style={{ color: cliqueBlue, fontWeight: "400" }}>
            {username + " "}
          </Text>
          created a new event: {eventTitle}
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
                    deleteGroupFromDb(item.groupID, item.users);
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
    return (
      <SwipeOut {...swipeSettings}>
        <TouchableOpacity
          style={styles.chatList}
          onPress={() =>
            this.props.navigation.navigate("Chat", {
              group: item,
              image: { uri: item.photoURL }
            })
          }
        >
          <View style={{ flexDirection: "row" }}>
            <GroupPicture
              cached={true}
              source={{ uri: item.photoURL }}
              value={0.14}
            />
            <View style={{ flexDirection: "column", left: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: Dimensions.get("window").width * 0.75
                }}
              >
                <Text h3 semibold>
                  {item.groupName}
                </Text>
                <Text>{this.renderTimestamp(item.groupID)}</Text>
              </View>
              <View style={{ padding: 2, width: "90%" }}>
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
                    bottom: 1
                  }}
                />
              ) : (
                undefined
              )}
            </View>
          </View>
        </TouchableOpacity>
      </SwipeOut>
    );
  };

  scrollToTop = () => {
    this.refs.groupList.scrollToOffset({ animated: false, offset: 0 });
  };

  render() {
    return (
      <View>
        <FlatList
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
    borderColor: "#CCC"
  }
});

const mapStateToProps = state => {
  return {
    groups: state.groupsReducer.groups,
    groupsMessageCounter: state.messageCounterReducer.groups
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
    setToZero
  }
)(GroupScreen);
