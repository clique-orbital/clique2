import React, { Component } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-navigation";

import { connect } from "react-redux";
import { setUserDetails } from "../../store/actions/auth";
import firebase from "react-native-firebase";
import cliqueBlue from "../../assets/constants";

import icon from "../../assets/icon.png";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      message: "",
      codeInput: "",
      phoneNumber: "+65", // need to change
      confirmResult: null
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUserDetails(user.toJSON());
        this.props.navigation.navigate("App");
      } else {
        // User has been signed out, reset the state
        this.props.setUserDetails(null);
        this.setState({
          message: "",
          codeInput: "",
          phoneNumber: "+65", // need to change
          confirmResult: null
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: "" }))
      .catch(error =>
        this.setState({
          message: `${error.message}`
        })
      );
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(user => {
          const ref = firebase.database().ref("users");
          ref.on(
            "value",
            snapshot => {
              this.props.navigation.navigate(
                snapshot.val()[user._user.uid] ? "App" : "UserDetails"
              );
            },
            err => {
              console.log("the read failed " + err.code);
            }
          );
        })
        .catch(error => {
          this.setState({ message: `Code Confirm Error: ${error.message}` });
        });
    }
  };

  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;

    return (
      <SafeAreaView
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
        <Text style={styles.welcome}>Welcome to Clique</Text>
        <Text style={styles.text}>
          What number can people use to reach you?
        </Text>
        <TextInput
          autoFocus
          style={{
            width: "70%",
            height: 40,
            marginTop: 15,
            marginBottom: 15,
            borderBottomColor: "grey",
            borderBottomWidth: StyleSheet.hairlineWidth
          }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={"Phone number"}
          value={phoneNumber}
        />
        <Button title="Continue" color="blue" onPress={this.signIn} />
        <Text style={styles.fineprint}>
          Press continue to verify your account through a SMS code sent to your
          phone number. Message and data rates may apply.
        </Text>
      </SafeAreaView>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return <Text style={styles.message}>{message}</Text>;
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <SafeAreaView
        style={{
          marginTop: 25,
          padding: 25,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ textAlign: "center" }}>
          A six digit verification code has been sent to
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "400", marginBottom: "10%" }}>
          {this.state.phoneNumber}
        </Text>
        <Text> Please enter it below:</Text>
        <TextInput
          autoFocus
          style={{
            height: 40,
            marginTop: "10%",
            marginBottom: "15%",
            fontSize: 40
          }}
          color={cliqueBlue}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={"_ _ _ _ _ _"}
          value={codeInput}
        />
        <Button
          title="Confirm Code"
          color="#841584"
          onPress={this.confirmCode}
        />
      </SafeAreaView>
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
      currentRender = (
        <View>
          {this.renderVerificationCodeInput()}
          {this.renderMessage()}
        </View>
      );
    } else {
      this.props.navigation.navigate("UserDetails");
    }

    return <SafeAreaView style={{ flex: 1 }}>{currentRender}</SafeAreaView>;
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

const styles = StyleSheet.create({
  message: {
    margin: "5%",
    textAlign: "center"
  },
  welcome: {
    margin: "10%",
    textAlign: "center",
    fontSize: 40,
    fontWeight: "300"
  },
  text: {
    textAlign: "center",
    color: "grey"
  },
  fineprint: {
    color: "grey",
    fontSize: 10,
    marginTop: 10
  }
});

export default connect(
  mapStateToProps,
  { setUserDetails }
)(Auth);
