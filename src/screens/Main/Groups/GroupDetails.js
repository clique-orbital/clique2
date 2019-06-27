import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import Text from "../../../components/Text";
import ContinueButton from "../../../components/ContinueButton";
import { createGroup, editGroup } from "../../../store/actions/groups";
import defaultPicture from "../../../assets/default_profile.png";
import ImagePicker from "../../../components/ImagePickerComponent";
import HeaderTitle from "../../../components/HeaderTitle";
import Spinner from "../../../components/Spinner";

const required = value => (value ? undefined : "Required");

class GroupDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
    this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{ bottom: 5 }}>
          <HeaderTitle title={navigation.getParam("title")} />
        </View>
      )
    };
  };

  handleSubmitCreate = values => {
    this.setState({ loading: true });
    this.props
      .dispatch(
        createGroup(
          values.groupname,
          values.grouppicture.uri,
          values.grouppicture.fileName.split(".")[1],
          this.props.user.uid,
          "This is a new clique!",
          Object.values(this.props.navigation.getParam("users"))
        )
      )
      .then(() => {
        this.props.navigation.navigate("Main");
      });
  };

  handleSubmitEdit = values => {
    this.setState({ loading: true });
    this.props
      .dispatch(
        editGroup(
          this.props.navigation.getParam("groupID"),
          values.groupname,
          values.grouppicture.uri,
        )
      )
      .then(group => {
        this.props.navigation.navigate("GroupInformation", {
          group,
          image: { uri: group.photoURL }
        })
      });
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

  renderInput = ({ input, label }) => {
    return (
      <TextInput
        {...input}
        style={[styles.textInput, { marginTop: 5 }]}
        placeholder={label}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: "15%" }}>
          <Text body grey style={styles.text}>
            Enter your group name and group picture!
          </Text>
          <Field
            name="grouppicture"
            component={this.renderImagePicker}
            validate={required}
          />
          <Field
            name="groupname"
            component={this.renderInput}
            label="Enter group name"
            validate={required}
          />
        </View>
        <TouchableOpacity
          title="Create"
          onPress={this.props.handleSubmit(this.props.navigation.getParam("type") === "create" ? this.handleSubmitCreate : this.handleSubmitEdit)}
          style={{ position: "absolute", top: "90%", left: "80%" }}
        >
          <ContinueButton name="arrow-forward" />
        </TouchableOpacity>
        {this.state.loading && <Spinner />}
      </View>
    );
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
    marginBottom: 10
  },
  textInput: {
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
    top: "20%",
    height: 40,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.authReducer.user,
    group: state.groupsReducer.groups[ownProps.navigation.getParam("groupID")]
  };
};

let form = reduxForm({ form: "groupDetails" })(GroupDetails);
export default connect(mapStateToProps)(form);
