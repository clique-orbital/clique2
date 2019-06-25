import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { SafeAreaView } from "react-navigation";
import ImagePicker from "../../components/ImagePickerComponent";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import MyIcon from "../../components/MyIcon";
import { createAccount } from "../../store/actions/auth";
import defaultPicture from "../../assets/default_profile.png";
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "../../components/Spinner";

class UserDetails extends React.Component {
  state = { loading: false };
  storeData = async (key, val) => {
    try {
      val = JSON.stringify(val);
      if (val) {
        await AsyncStorage.setItem(key, val);
      } else {
        console.log("no value");
      }
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  handleSubmit = async values => {
    this.setState({ loading: true });
    this.storeData("profilePicture", values.profilepicture.uri);
    await this.props.createAccount(
      values.username,
      values.profilepicture.uri,
      values.profilepicture.fileName.split(".")[1]
    );
    this.props.navigation.navigate("App");
  };

  renderInput = ({ input, label, meta }) => {
    return (
      <TextInput {...input} style={styles.textInput} placeholder={label} />
    );
  };

  renderImagePicker = props => {
    return (
      <ImagePicker
        width={Dimensions.get("window").width}
        {...props.input}
        value={defaultPicture}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>
          Enter your username and profile picture!
        </Text>
        <Field name="profilepicture" component={this.renderImagePicker} />
        <Field
          name="username"
          component={this.renderInput}
          label="Enter username"
        />
        <TouchableHighlight
          title="Continue"
          style={styles.button}
          // weird syntax to get redux-form to bind submit this.handleSubmit() function to the designated form submit
          onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "blue", marginRight: 7 }}>Continue</Text>
            <View style={{ marginTop: 1 }}>
              <MyIcon name="ios-arrow-forward" size={13} color="blue" />
            </View>
          </View>
        </TouchableHighlight>
        {this.state.loading && <Spinner />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "25%"
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  textInput: {
    marginTop: "10%",
    height: 16,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  button: {
    marginTop: 20
  }
});

let form = reduxForm({ form: "UserDetails" })(UserDetails);
export default connect(
  null,
  { createAccount }
)(form);
