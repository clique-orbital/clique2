import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions
} from "react-native";
import firebase from "react-native-firebase";
import _ from "lodash";
import HeaderTitle from "../../components/HeaderTitle";
import MyIcon from "../../components/MyIcon";
import {
  fetchedGroups,
  fetchAGroup,
  sortGroups,
  fetchGroups
} from "../../store/actions/groups";
import { connect } from "react-redux";
import GroupPicture from "../../components/GroupPicture";

const cliqueBlue = "#134782";

class GroupScreen extends Component {
  constructor(props) {
    super(props);
  }

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

    if (this.props.groups) {
      for (let groupId of Object.keys(this.props.groups)) {
        db.ref(`groups/${groupId}/last_message`).on(
          "child_changed",
          snapshot => {
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
        <Text style={{ top: 5 }} numberOfLines={1}>
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
        <Text style={{ top: 5 }} numberOfLines={1}>
          <Text style={{ color: cliqueBlue, fontWeight: "400" }}>
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
    return (
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
          <GroupPicture source={{ uri: item.photoURL }} value={0.14} />
          <View style={{ flexDirection: "column", left: 15 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: Dimensions.get("window").width * 0.75
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {item.groupName}
              </Text>
              <Text>{this.renderTimestamp(item.groupID)}</Text>
            </View>
            <View style={{ padding: 2, width: "90%" }}>
              {this.renderLastMessage(item.groupID)}
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    groups: state.groupsReducer.groups
  };
};

export default connect(
  mapStateToProps,
  { fetchAGroup, fetchedGroups, sortGroups, fetchGroups }
)(GroupScreen);
