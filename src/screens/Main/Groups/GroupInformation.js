import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { connect } from "react-redux";
import GroupPicture from "../../../components/GroupPicture";
import firebase from "react-native-firebase";
import Text from "../../../components/Text";

class GroupInformation extends React.Component {
  state = { users: [] };

  componentDidMount() {
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
  }

  renderRow = ({ item }) => {
    return (
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
        <Text>{item.displayName}</Text>
      </View>
    );
  };

  renderFlatList = () => {
    return (
      <FlatList
        data={this.state.users}
        renderItem={this.renderRow}
        keyExtractor={item => item.uid}
      />
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

const mapStateToProps = (state, ownProps) => {
  return {
    group: state.groupsReducer.groups[ownProps.navigation.getParam("groupID")]
  };
};

export default connect(mapStateToProps)(GroupInformation);
