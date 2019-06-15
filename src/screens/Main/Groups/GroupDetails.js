import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import ContinueButton from "../../../components/ContinueButton";
import { createGroup } from "../../../store/actions/groups";
import defaultPicture from "../../../assets/default_profile.png";
import ImagePicker from "../../../components/ImagePickerComponent";
import HeaderTitle from "../../../components/HeaderTitle";

const required = value => (value ? undefined : "Required");

class GroupDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{ bottom: 5 }}>
          <HeaderTitle title="New Group" />
        </View>
      )
    };
  };

  handleSubmit = async values => {
    await this.props.createGroup(
      values.groupname,
      values.grouppicture.uri,
      this.props.user.uid,
      "This is a new clique!",
      Object.values(this.props.navigation.getParam("users"))
    );
    this.props.navigation.navigate("Main");
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

  renderInput = ({ input, label, meta }) => {
    return (
      <TextInput {...input} style={[styles.textInput, { marginTop: 5 }]} placeholder={label} />
    );
  };

  renderGroupPicture = () => {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: "15%" }}>
          <Text style={styles.text}>
            Enter your group name and group picture!
          </Text>
          <Field
            name="grouppicture"
            component={this.renderImagePicker}
            validate={required}
          />
          <Field
            name="groupname"
            component={props => this.renderInput(props)}
            label="Enter group name"
            validate={required}
          />
        </View>
        <TouchableOpacity
          title="Create"
          onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
          style={{ position: "absolute", top: "90%", left: "80%" }}
        >
          <ContinueButton />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return this.renderGroupPicture();
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%"
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  textInput: {
    top: "20%",
    height: 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

const mapStateToProps = state => {
  return { user: state.authReducer.user };
};

let form = reduxForm({ form: "groupDetails" })(GroupDetails);
export default connect(
  mapStateToProps,
  { createGroup }
)(form);
