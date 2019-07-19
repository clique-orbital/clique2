import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-navigation";
import ImagePicker from "../../components/ImagePickerComponent";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import Input from "../../components/Input";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { createAccount } from "../../store/actions/auth";
import defaultPicture from "../../assets/default_profile.png";
import Spinner from "../../components/Spinner";

class UserDetails extends React.Component {
  state = {
    loading: false,
    username: ""
  };

  handleSubmit = values => {
    this.setState({ loading: true });
    this.props
      .createAccount(values.username, values.profilepicture.uri)
      .then(() => this.props.navigation.navigate("App"));
  };

  renderInput = ({ input, label }) => {
    return <Input {...input} style={styles.textInput} placeholder={label} />;
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
          autoCapitalize="sentences"
          name="username"
          component={this.renderInput}
          label="Enter username"
          value={this.state.username}
          onChange={text => this.setState({ username: text })}
        />
        <Button
          shadow
          onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
          style={{ width: "50%" }}
        >
          <Text semibold header center black>
            Continue
          </Text>
        </Button>
        {this.state.loading && <Spinner />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: "10%"
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  textInput: {
    margin: "5%",
    height: 16,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

let form = reduxForm({ form: "UserDetails" })(UserDetails);
export default connect(
  null,
  { createAccount }
)(form);
