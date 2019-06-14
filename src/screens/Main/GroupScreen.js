import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import firebase from "react-native-firebase";
import _ from "lodash";
import HeaderTitle from "../../components/HeaderTitle";
import MyIcon from "../../components/MyIcon";
import { fetchedGroups, fetchAGroup } from "../../store/actions/groups";
import { connect } from "react-redux";

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

  componentWillMount() {
    const uid = firebase.auth().currentUser._user.uid;
    const db = firebase.database();
    db.ref(`groups`).on("child_added", async snapshot => {
      console.log(snapshot.val());
      if (snapshot.val().users[uid]) {
        await this.fetchGroups();
        Object.keys(this.props.groups).forEach(groupId => {
          db.ref(`groups/${groupId}/last_message`).on(
            "child_changed",
            snapshot => {
              this.fetchGroup(groupId);
            }
          );
        });
      }
    });
  }

  fetchGroup = groupId => {
    firebase
      .database()
      .ref(`groups/${groupId}/last_message`)
      .once("value", snapshot => {
        this.props.fetchAGroup(groupId, snapshot.val());
      });
  };

  fetchGroups = async () => {
    const userUID = firebase.auth().currentUser._user.uid;
    const snapshot = await firebase
      .database()
      .ref(`users/${userUID}/groups`)
      .once("value");
    const groupIDs = _.keys(snapshot.val());
    const groups = {};
    await Promise.all(
      groupIDs.map(async groupID => {
        const data = await firebase
          .database()
          .ref(`groups/${groupID}`)
          .once("value");
        groups[groupID] = data.val();
      })
    );
    const sortedArr = Object.values(groups).sort(
      (a, b) => b.last_message.timestamp - a.last_message.timestamp
    );
    const sortedGroups = {};
    sortedArr.forEach(group => {
      sortedGroups[group.groupID] = group;
    });
    return this.props.fetchedGroups(sortedGroups);
  };

  renderLastMessage = groupId => {
    const username = this.props.groups[groupId].last_message.username;
    const message = this.props.groups[groupId].last_message.message;

    return (
      <Text style={{ top: 5 }}>
        {username}
        {username ? ": " : ""}
        {message}
      </Text>
    );
  };

  renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatList}
        onPress={() =>
          this.props.navigation.navigate("Chat", {
            group: item
          })
        }
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: item.photoURL }} style={styles.groupPicture} />
          <View style={{ flexDirection: "column", left: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {item.groupName}
            </Text>
            {this.renderLastMessage(item.groupID)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <FlatList
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
  },
  groupPicture: {
    height: 44,
    width: 44,
    borderRadius: 22
  },
  lastMessage: {}
});

const mapStateToProps = state => {
  return {
    groups: state.groupsReducer.groups
  };
};

export default connect(
  mapStateToProps,
  { fetchAGroup, fetchedGroups }
)(GroupScreen);
