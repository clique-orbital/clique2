import React from "react";
import { Text, Button, StyleSheet, Image } from "react-native";
import { SafeAreaView, createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { SIGN_OUT } from "../../store/constants";

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

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
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image 
          source={{uri: this.props.profilePic}}
          style={styles.profilePic}
        />
        <Text>Your name: { this.props.username }</Text>
        <Text>Your phone number: { this.props.phoneNumber }</Text>
        <Button
          title="Sign Out"
          onPress={this.signOut}
        />
      </SafeAreaView>
    );
  }
}

const SettingsStack = createStackNavigator({
  Main: SettingsScreen
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 50
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    phoneNumber: state.authReducer.user.phoneNumber,
    username: state.authReducer.user.displayName,
    profilePic: state.authReducer.user.photoURL
  }
}

export default connect(
  mapStateToProps,
  null
)(SettingsScreen);
