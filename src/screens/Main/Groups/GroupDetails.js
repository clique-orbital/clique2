import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar
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
      groupName: this.props.navigation.getParam("type") === "create" ? "" : this.props.group.groupName
    }
    this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{ bottom: 5 }}>
          <HeaderTitle title={navigation.getParam("title")} />
        </View>
      ),
      headerTintColor: "#fff",
      headerStyle: {
        borderBottomColor: "transparent",
      },
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
          this.props.user.displayName,
          "This is a new clique!",
          Object.values(this.props.navigation.getParam("users"))
        )
      )
      .then(() => {
        this.props.navigation.navigate("Main");
      });
  };

  handleSubmitEdit = values => {
    console.log(values);
    this.setState({ loading: true });
    this.props
      .dispatch(
        editGroup(
          this.props.navigation.getParam("groupID"),
          (values.groupname || this.state.groupName),
          ((values.grouppicture || {}).uri || this.props.group.photoURL),
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
        value={this.props.navigation.getParam("type") === "create" ? defaultPicture : { uri: this.props.group.photoURL }}
      />
    );
  };

  renderInput = ({ input, label }) => {
    return (
      <TextInput
        {...input}
        keyboardAppearance={this.props.colors.keyboard}
        value={this.state.groupName}
        onChangeText={text => this.setState({ groupName: text })}
        style={[styles.textInput, { marginTop: 5, color: this.props.colors.textColor }]}
        placeholder={label}
        placeholderTextColor={this.props.colors.placeholderColor}
        defaultValue={this.props.navigation.getParam("type") === "create" ? "" : this.props.group.groupName}
      />
    );
  };

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.colors.whiteBlack }]}>
        <StatusBar barStyle="light-content" />
        <View style={{ marginTop: "15%" }}>
          <Text body grey style={styles.text}>
            Enter your group name and group picture!
          </Text>
          <Field
            autoCapitalize="sentences"
            name="grouppicture"
            component={this.renderImagePicker}
            validate={this.props.navigation.getParam("type") === "create" ? required : null}
          />
          <Field
            autoCapitalize="sentences"
            name="groupname"
            component={this.renderInput}
            label="Enter group name"
            validate={this.props.navigation.getParam("type") === "create" ? required : null}
            value={this.state.groupName}
            onChange={text => this.setState({ groupName: text })}
          />
        </View>
        <TouchableOpacity
          title="Create"
          onPress={this.props.handleSubmit(this.props.navigation.getParam("type") === "create" ? this.handleSubmitCreate : this.handleSubmitEdit)}
          style={{ position: "absolute", top: "90%", left: "80%" }}
        >
          <ContinueButton name="arrow-forward" btnColor={this.props.colors.continueButton} />
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
    group: state.groupsReducer.groups[ownProps.navigation.getParam("groupID")] || {},
    colors: state.theme.colors
  };
};

let form = reduxForm({ form: "groupDetails" })(GroupDetails);
export default connect(mapStateToProps)(form);
