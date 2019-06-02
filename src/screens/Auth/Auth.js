import React, { Component } from "react";
import { View, Button, Text, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-navigation";

import { connect } from "react-redux";
import { setUserDetails } from "../../store/actions/auth";
import firebase from "react-native-firebase";

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
    this.setState({ message: "Sending code ..." });

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult =>
        this.setState({ confirmResult, message: "Code has been sent!" })
      )
      .catch(error =>
        this.setState({
          message: `Sign In With Phone Number Error: ${error.message}`
        })
      );
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(user => {
          console.log(this.props.user);
          this.props.navigation.navigate("App");
        })
        .catch(error => {
          this.setState({ message: `Code Confirm Error: ${error.message}` });
        });
    }
  };

  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;

    return (
      <SafeAreaView style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={"Phone number"}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </SafeAreaView>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: "#000", color: "#fff" }}>
        {message}
      </Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={"Code ... "}
          value={codeInput}
        />
        <Button
          title="Confirm Code"
          color="#841584"
          onPress={this.confirmCode}
        />
      </View>
    );
  }

  render() {
    const { confirmResult } = this.state;
    const user = this.props.user;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && this.props.navigation.navigate("App")}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(
  mapStateToProps,
  { setUserDetails }
)(Auth);
