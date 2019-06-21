import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { SIGN_OUT } from "../../store/constants";
import defaultPicture from "../../assets/default_profile.png";
import AsyncStorage from "@react-native-community/async-storage";

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: ""
    };
  }

  static navigationOptions = {
    headerTitle: <HeaderTitle title="Settings" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  componentDidMount() {
    this.retrieveItem("profilePicture")
      .then(uri => {
        this.setState(prevState => {
          return {
            ...prevState,
            uri
          };
        });
      })
      .catch(e => console.log(e));
  }

  async retrieveItem(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  signOut = () => {
    firebase.auth().signOut();
    this.props.dispatch({ type: SIGN_OUT });
    this.props.navigation.navigate("Auth");
  };

  renderProfilePic() {
    if (this.state.uri === "") {
      return <Image source={defaultPicture} style={styles.profilePic} />;
    } else {
      return (
        <Image source={{ uri: this.state.uri }} style={styles.profilePic} />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderProfilePic()}
        <Text>Your name: {this.props.username}</Text>
        <Text>Your phone number: {this.props.phoneNumber}</Text>
        <Button
          title="Sign Out"
          type="clear"
          onPress={this.signOut}
          buttonStyle={{ top: 10 }}
        />
      </View>
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
    username: state.authReducer.user.displayName
  };
};

export default connect(
  mapStateToProps,
  null
)(SettingsScreen);
