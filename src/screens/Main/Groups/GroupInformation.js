import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar
} from "react-native";
import SwipeOut from "react-native-swipeout";
import GroupPicture from "../../../components/GroupPicture";
import firebase from "react-native-firebase";
import Text from "../../../components/Text";
import MyIcon from "../../../components/MyIcon";
import theme from "../../../assets/theme";
import { connect } from "react-redux";
import { removeUser, removeGroup } from "../../../store/actions/groups";
import { removeGroupEvents } from "../../../store/actions/calendar";
import { removeGroupMessages } from "../../../store/actions/messages";

class GroupInformation extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const group = navigation.getParam("group");
    navigation.goBack = () =>
      navigation.navigate("Chat", {
        group,
        image: navigation.getParam("image")
      });
    return {
      gesturesEnabled: false,
      headerTintColor: "#fff",
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
        shadowOffset: 0,
        shadowColor: "transparent"
      },
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Chat", {
              group,
              image: { uri: group.photoURL }
            });
          }}
          style={{ alignSelf: "flex-start", paddingTop: 10, paddingLeft: 10 }}
        >
          <MyIcon name="arrow-back" color="white" size={25} type="material" />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("GroupDetails", {
              title: "Edit Group",
              type: "edit",
              groupID: group.groupID
            })
          }
          style={{ paddingTop: 12, paddingRight: 10, alignSelf: "flex-start" }}
        >
          <Text white style={{ fontSize: 20 }}>
            Edit
          </Text>
        </TouchableOpacity>
      )
    };
  };

  state = { users: [] };

  componentDidMount() {
    this.populateState();
  }

  populateState = () => {
    this.setState({ users: [] });
    for (let uid in this.props.group.users) {
      firebase
        .database()
        .ref(`users/${uid}`)
        .once("value")
        .then(snapshot => {
          this.setState(prevState => {
            return {
              ...prevState,
              users: [...prevState.users, snapshot.val()]
            };
          });
        });
    }
  };

  renderRow = ({ item }) => {
    const uid = this.props.self.uid;

    const swipeSettings = {
      autoClose: true,
      right: [
        {
          onPress: () => {
            Alert.alert(
              item.uid === uid ? "Leave group" : "Remove member",
              item.uid === uid
                ? "Are you sure you want to leave this group?"
                : "Are you sure you want to remove this member?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Delete"),
                  style: "cancel"
                },
                {
                  text: "Yes",
                  onPress: () =>
                    this.remove(
                      item.uid,
                      this.props.navigation.getParam("group").groupID,
                      item.uid === uid
                    )
                },
                { cancelable: true }
              ]
            );
          },
          text: item.uid === uid ? "Leave" : "Remove",
          type: "delete"
        }
      ],
      rowId: item.id,
      backgroundColor: this.props.colors.whiteBlack
    };
    return (
      <SwipeOut {...swipeSettings}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingVertical: 5,
            alignItems: "center",
            borderBottomColor: this.props.colors.hairlineColor,
            borderBottomWidth: StyleSheet.hairlineWidth
          }}
        >
          <View style={{ paddingLeft: 10 }}>
            <GroupPicture source={{ uri: item.photoURL }} value={0.1} />
          </View>
          <Text
            h2
            style={{ paddingLeft: "5%", color: this.props.colors.textColor }}
          >
            {item.displayName}
          </Text>
        </View>
      </SwipeOut>
    );
  };

  removeEventsFromUser = (uid, groupID) => {
    return firebase
      .database()
      .ref(`users/${uid}/attending/${groupID}`)
      .remove();
  };

  remove = (uid, groupID, leave) => {
    this.props
      .removeUser(uid, groupID, leave)
      .then(() => {
        if (!leave) {
          this.populateState();
          this.props.removeGroup(groupID);
        } else {
          this.props.removeGroupEvents(groupID);
          this.props.removeGroupMessages(groupID);
        }
      })
      .then(() => {
        this.removeEventsFromUser(uid, groupID);
        if (leave) this.props.navigation.navigate("Main");
      });
  };

  renderAddMember = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("AddMembers", {
            group: this.props.navigation.getParam("group"),
            populateState: this.populateState
          })
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomColor: this.props.colors.hairlineColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
          justifyContent: "center",
          paddingVertical: 20
        }}
      >
        <MyIcon name="person-add" size={30} color="#1965BC" type="material" />
        <Text h3 color="#1965BC" style={{ paddingLeft: "3%" }}>
          Add Member
        </Text>
      </TouchableOpacity>
    );
  };

  renderFlatList = () => {
    return (
      <View>
        {this.renderAddMember()}
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.uid}
        />
      </View>
    );
  };

  render() {
    const group = this.props.navigation.getParam("group");

    return (
      <View
        style={{
          display: "flex",
          height: "100%",
          backgroundColor: this.props.colors.whiteBlack
        }}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            backgroundColor: this.props.colors.headerColor
          }}
        >
          <GroupPicture value={0.2} source={{ uri: group.photoURL }} />
          <Text white medium h2 style={{ marginVertical: 20 }}>
            {group.groupName}
          </Text>
        </View>
        {this.renderFlatList()}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    self: state.authReducer.user,
    group:
      state.groupsReducer.groups[ownProps.navigation.getParam("group").groupID],
    colors: state.theme.colors
  };
};

export default connect(
  mapStateToProps,
  { removeUser, removeGroup, removeGroupEvents, removeGroupMessages }
)(GroupInformation);
