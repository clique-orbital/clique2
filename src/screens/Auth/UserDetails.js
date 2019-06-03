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
import { setUsername } from "../../store/actions/auth";
import defaultPicture from "../../assets/default_profile.png";

class UserDetails extends React.Component {
  handleSubmit = values => {
    this.props.setUsername(values.username);
  };

  renderInput = ({ input, label }) => {
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
          component={props => this.renderInput(props)}
          label="Enter username"
        />
        <TouchableHighlight
          title="Continue"
          style={styles.button}
          onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "blue", marginRight: 7 }}>Continue</Text>
            <View style={{ marginTop: 1 }}>
              <MyIcon name="ios-arrow-forward" size={13} color="blue" />
            </View>
          </View>
        </TouchableHighlight>
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
    width: "70%",
    height: 15,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  button: {
    marginTop: 20
  }
});

let form = reduxForm({ form: "userDetails" })(UserDetails);
export default connect(
  null,
  { setUsername }
)(form);
