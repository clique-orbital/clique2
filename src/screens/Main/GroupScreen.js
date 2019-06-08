import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
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
        <TouchableOpacity onPress={() => navigation.navigate("Create")}>
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
    const snapshot = await ref.once('value');
    const groupIDs = _.keys(snapshot.val());
    const groups = [];
    groupIDs.map(groupID => {
      const groupRef = firebase.database().ref(`groups/${groupID}`);
      groupRef.once('value').then(snapshot => {
        groups.push(snapshot.val());
        this.props.dispatch(fetchedGroups(groups));
      }).catch(e => console.log(e))
    });
  }

  renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatList}
        onPress={() =>
          this.props.navigation.navigate("Chat", {
            group: item,
          })
        }
      >
        <Text style={{ fontSize: 16 }}>{item.groupName}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return(
      <View>
        <FlatList
          data={this.props.groups}
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
  }
}

export default connect(
  mapStateToProps
)(GroupScreen);