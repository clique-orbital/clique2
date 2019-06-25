import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import SwipeOut from "react-native-swipeout";

import GroupPicture from "../../../components/GroupPicture";
import firebase from "react-native-firebase";
import Text from "../../../components/Text";
import MyIcon from "../../../components/MyIcon";
import theme from "../../../assets/theme";

class GroupInformation extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const group = navigation.getParam("group");

    return {
      headerTintColor: "#fff",
      headerStyle: {
        borderBottomColor: "transparent",
        height: Dimensions.get("window").height * 0.17,
        backgroundColor: theme.colors.cliqueBlue
      },
      headerTitle: (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <GroupPicture value={0.2} source={{ uri: group.photoURL }} />
          <Text white medium h2 style={{ paddingLeft: "5%" }}>
            {group.groupName}
          </Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ alignSelf: "flex-start", paddingTop: 10, paddingLeft: 10 }}
        >
          <MyIcon name="arrow-back" color="white" size={25} type="material" />
        </TouchableOpacity>
      )
    };
  };

  state = { users: [] };

  componentDidMount() {
    for (let uid in this.props.navigation.getParam("group").users) {
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
  }

  renderRow = ({ item }) => {
    const swipeSettings = {
      autoClose: true,
      right: [
        {
          onPress: () => {
            Alert.alert(
              "Remove member",
              "Are you sure you want to remove this member?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Delete"),
                  style: "cancel"
                },
                {
                  text: "Yes",
                  onPress: () => {}
                },
                { cancelable: true }
              ]
            );
          },
          text: "Remove",
          type: "delete"
        }
      ],
      rowId: item.id,
      backgroundColor: "#fff"
    };
    return (
      <SwipeOut {...swipeSettings}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingVertical: 5,
            alignItems: "center",
            borderBottomColor: "lightgrey",
            borderBottomWidth: StyleSheet.hairlineWidth
          }}
        >
          <View style={{ paddingLeft: 10 }}>
            <GroupPicture source={{ uri: item.photoURL }} value={0.1} />
          </View>
          <Text h4 style={{ paddingLeft: "5%" }}>
            {item.displayName}
          </Text>
        </View>
      </SwipeOut>
    );
  };

  renderAddMember = () => {
    return (
      <TouchableOpacity
        onPress={this.addMember}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomColor: "lightgrey",
          borderBottomWidth: StyleSheet.hairlineWidth,
          paddingBottom: "5%",
          paddingTop: "3%",
          paddingHorizontal: "5%"
        }}
      >
        <MyIcon
          name="person-add"
          size={30}
          color={theme.colors.light_chat_username}
          type="material"
        />
        <Text
          h3
          color={theme.colors.light_chat_username}
          style={{ paddingLeft: "3%" }}
        >
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
    console.log(this.state.users);
    return (
      <View style={{ display: "flex", height: "100%" }}>
        {this.renderFlatList()}
      </View>
    );
  }
}

export default GroupInformation;
