import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-navigation";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";

import { connect } from "react-redux";
import { setUserDetails } from "../../store/actions/auth";
import { fetchGroups } from "../../store/actions/groups";
import {
  fetchAllEvents,
  fetchPersonalEvents
} from "../../store/actions/calendar";
import { populateGroups } from "../../store/actions/messageCounter";
import firebase from "react-native-firebase";
import cliqueBlue from "../../assets/constants";
import theme from "../../assets/theme";
import Spinner from "../../components/Spinner";
import NetInfo from "@react-native-community/netinfo";
import LoadingView from "../../components/LoadingView";
import icon from "../../assets/icon.png";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      codeInput: "",
      phoneNumber: "+65", // need to change
      confirmResult: null,
      loading: false,
      splash: true
    };

    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      this.onTokenRefreshListener = firebase
        .messaging()
        .onTokenRefresh(fcmToken => {
          this.getToken(firebase.auth().currentUser.uid, fcmToken);
        });
      if (user) {
        if (user.displayName && user.photoURL) {
          NetInfo.fetch()
            .then(state => {
              if (state.isConnected) {
                this.props.setUserDetails(user);
                this.props
                  .fetchGroups()
                  .then(() => this.props.fetchAllEvents(user.uid))
                  .then(() => this.props.fetchPersonalEvents(user.uid))
                  .then(() => this.checkPermission(user.uid))
                  .then(() => Promise.resolve());
              }
            })
            .then(() => {
              this.props.navigation.navigate("App");
            });
        } else {
          // get user to set username and profile picture
          this.props.navigation.navigate("UserDetails");
        }
      } else {
        this.setState({ splash: false });
      }
    });
  }

  checkPermission(uid) {
    return firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission granted");
          this.getToken(uid);
        } else {
          console.log("Request Permission");
          this.requestPermission(uid);
        }
      });
  }

  requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken(uid);
      })
      .catch(error => {
        console.log("permission rejected");
      });
  }

  async getToken(uid, token) {
    if (!token) {
      fcmToken = await firebase.messaging().getToken();
    }
    return firebase
      .database()
      .ref(`users/${uid}/notificationToken`)
      .set(token || fcmToken);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.onTokenRefreshListener();
  }

  signIn = () => {
    this.setState({ loading: true });
    const { phoneNumber } = this.state;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => {
        this.setState({ loading: false });
        this.props.setUserDetails(firebase.auth().currentUser);
        this.setState({ confirmResult, message: "" });
      })
      .catch(error =>
        this.setState({
          message: `${error.message}`
        })
      );
  };

  confirmCode = () => {
    this.setState({ loading: true });

    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(user => {
          firebase
            .database()
            .ref("users")
            .once("value", snapshot => {
              this.setState({ loading: false });
              this.props.navigation.navigate(
                snapshot.val()[user._user.uid] ? "App" : "UserDetails"
              );
            });
        })
        .catch(error => {
          this.setState({ message: `Code Confirm Error: ${error.message}` });
        });
    }
  };

  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;

    return (
      <View
        style={{
          padding: 25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={icon}
          style={{
            width: Dimensions.get("window").width / 2,
            height: Dimensions.get("window").width / 2,
            borderRadius: Dimensions.get("window").width / 4
          }}
        />
        <Text h1 black center style={styles.welcome}>
          Welcome to Clique
        </Text>
        <Text body gray center>
          What number can people use to reach you?
        </Text>
        <Input
          phone
          style={[
            styles.input,
            styles.border,
            Platform.OS === "ios" ? { paddingVertical: 10 } : null
          ]}
          onChangeText={value => this.setState({ phoneNumber: value })}
          value={phoneNumber}
          w={Dimensions.get("window").width * 0.5}
        />
        <Button shadow onPress={this.signIn} style={{ width: "70%" }}>
          <Text center semibold>
            Continue
          </Text>
        </Button>
        <Text center gray caption style={styles.fineprint}>
          Press continue to verify your account through a SMS code sent to your
          phone number. Message and data rates may apply.
        </Text>
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;
    if (!message.length) return null;
    return (
      <Text medium style={styles.message}>
        {message}
      </Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View
        style={{
          top: "30%",
          padding: 25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text center>A six digit verification code has been sent to</Text>
        <Text medium h2 style={{ marginBottom: 20 }}>
          {this.state.phoneNumber}
        </Text>
        <Text> Please enter it below:</Text>
        <Input
          phone
          h={100}
          w={200}
          style={[
            styles.input,
            {
              fontSize: 40
            }
          ]}
          color={cliqueBlue}
          onChangeText={value => this.setState({ codeInput: value })}
          value={codeInput}
        />
        <Button shadow onPress={this.confirmCode} style={{ width: "70%" }}>
          <Text center semibold>
            Confirm Code
          </Text>
        </Button>
        {this.renderMessage()}
      </View>
    );
  }

  render() {
    const { confirmResult } = this.state;
    const user = this.props.user;
    let currentRender;

    if (!user && !confirmResult) {
      currentRender = (
        <View>
          {this.renderPhoneNumberInput()}
          {this.renderMessage()}
        </View>
      );
    } else if (!user && confirmResult) {
      currentRender = <View>{this.renderVerificationCodeInput()}</View>;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        {currentRender}
        {this.state.loading && !this.state.message && <Spinner />}
        {this.state.splash && <LoadingView />}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

const styles = StyleSheet.create({
  message: {
    margin: "5%",
    textAlign: "center",
    color: "red"
  },
  welcome: {
    margin: "10%",
    fontSize: 40,
    fontWeight: "300"
  },
  fineprint: {
    fontSize: 10,
    marginTop: 10
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  border: {
    borderBottomColor: theme.colors.gray2,
    width: "100%"
  }
});

export default connect(
  mapStateToProps,
  {
    setUserDetails,
    fetchGroups,
    fetchAllEvents,
    populateGroups,
    fetchPersonalEvents
  }
)(Auth);
