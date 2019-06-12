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
import { fetchedGroups } from "../../store/actions/groups";
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

  async componentDidMount() {
    const userUID = firebase.auth().currentUser._user.uid;
    const ref = firebase.database().ref(`users/${userUID}/groups`);
    const snapshot = await ref.once("value");
    const groupIDs = _.keys(snapshot.val());
    const groups = {};
    groupIDs.map(groupID => {
      const groupRef = firebase.database().ref(`groups/${groupID}`);
      groupRef
        .once("value")
        .then(snapshot => {
          groups[groupID] = snapshot.val();
          this.props.dispatch(fetchedGroups(groups));
        })
        .catch(e => console.log(e));
    });
  }

  renderLastMessage = groupId => {
    const username = this.props.groups[groupId].last_message.username;
    const message = this.props.groups[groupId].last_message.message;

    return (
      <Text>
        {username}: {message}
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
          <Text style={{ fontSize: 16, left: 10, fontWeight: "500" }}>
            {item.groupName}
          </Text>
          <View>{this.renderLastMessage(item.groupID)}</View>
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

export default connect(mapStateToProps)(GroupScreen);
