import React from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { SIGN_OUT } from "../../store/constants";
import defaultPicture from "../../assets/default_profile.png";

import Text from "../../components/Text";
import Button from "../../components/Button";
import GroupPicture from "../../components/GroupPicture";

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Settings" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  signOut = () => {
    firebase.auth().signOut();
    this.props.dispatch({ type: SIGN_OUT });
    this.props.navigation.navigate("Auth");
  };

  renderProfilePic() {
    return (
      <GroupPicture
        cached={true}
        source={{ uri: this.props.uri }}
        value={0.4}
      />
    );
  }

  render() {
    if (this.props.modalVisibility) StatusBar.setBackgroundColor("white");
    return (
      <View style={styles.container}>
        {this.renderProfilePic()}
        <Text center h3 light style={{ marginTop: 50 }}>
          @{this.props.username}
        </Text>
        <Text center h3 light>
          {this.props.phoneNumber}
        </Text>
        <Button
          shadow
          onPress={this.signOut}
          color="white"
          style={{ top: 10, width: "50%" }}
        >
          <Text center semibold>
            Sign Out
          </Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    phoneNumber: state.authReducer.user.phoneNumber,
    username: state.authReducer.user.displayName,
    uri: state.authReducer.user.photoURL
  };
};

export default connect(
  mapStateToProps,
  null
)(SettingsScreen);
