import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm } from "redux-form";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import theme from "../../../assets/theme";
import MyIcon from "../../../components/MyIcon";
import firebase from "react-native-firebase";
import { ScrollView } from "react-native-gesture-handler";

// navigation props: groupID

class CreatePoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      options: {}
    };
    this.onChangeQuestion = this.onChangeQuestion.bind(this);
  }

  static navigationOptions = () => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <Text h2 semibold white style={{ paddingHorizontal: 5 }}>
          Poll
        </Text>
      ),
      headerStyle: {
        borderBottomColor: "transparent"
      }
    };
  };

  renderInput = props => {
    return (
      <Input
        {...props.input}
        style={[
          props.style,
          { borderBottomColor: this.props.colors.hairlineColor }
        ]}
        {...props}
        keyboardAppearance={this.props.colors.keyboard}
        placeholderTextColor={this.props.colors.placeholderColor}
      />
    );
  };

  handleSubmit = formValues => {
    if (
      this.state.question !== "" &&
      this.state.options["0"] &&
      this.state.options["0"] !== ""
    ) {
      const nav = this.props.navigation;
      const groupID = nav.getParam("groupID");
      const uid = nav.getParam("uid");
      const username = nav.getParam("username");
      const db = firebase.database();
      let { question, options } = formValues;
      options = options.filter(option => option.title !== undefined);
      const msgID = db
        .ref("messages")
        .child(`${groupID}`)
        .push().key;
      let pollObject = { question, options, groupID, msgID };
      const message = {
        messageType: "poll",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sender: uid,
        pollObject,
        username: username
      };
      db.ref(`messages/${groupID}/${msgID}`).set(message);
      db.ref(`groups/${groupID}/last_message`)
        .set(message)
        .then(() => nav.goBack());
    }
  };

  onChangeQuestion = text => {
    this.setState({ question: text });
  };

  onChangeOptions = index => text => {
    this.setState({
      options: {
        ...this.state.options,
        [index]: text
      }
    });
  };

  renderQuestion = width => {
    return (
      <View
        style={[
          styles.border,
          {
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: this.props.colors.hairlineColor
          }
        ]}
      >
        <View style={{ marginHorizontal: 20 }}>
          <MyIcon
            type="material-community"
            name="comment-question-outline"
            color="darkgrey"
            size={30}
          />
        </View>
        <Field
          autoCapitalize="sentences"
          name="question"
          left
          component={this.renderInput}
          placeholder="Enter question"
          style={[
            styles.input,
            {
              fontSize: 20,
              fontWeight: "400",
              color: this.props.colors.textColor
            }
          ]}
          w={width}
          onChange={this.onChangeQuestion}
          value={this.state.question}
        />
      </View>
    );
  };

  renderAddOption = fields => {
    const allFields = fields.getAll();
    let allFieldsFilled = false;
    if (allFields) {
      allFieldsFilled = allFields.every(field => field.title !== undefined);
    } else {
      allFieldsFilled = true;
    }
    return (
      <TouchableOpacity
        onPress={() => (allFieldsFilled ? fields.push({}) : null)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View style={{ marginHorizontal: 20 }}>
            <MyIcon
              name="add"
              type="material"
              size={30}
              color={theme.colors.light_chat_background}
            />
          </View>
          <Text h2 center color={theme.colors.light_chat_background}>
            Add option
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderOptions = ({ fields }) => {
    return (
      <View style={{ paddingVertical: 10 }}>
        {fields.map((option, index) => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 2
              }}
              key={index}
            >
              <View style={{ marginRight: 20, marginLeft: 27 }}>
                <MyIcon
                  name="radio-button-unchecked"
                  type="material"
                  size={15}
                  color={this.props.colors.textColor}
                />
              </View>
              <Field
                autoCapitalize="sentences"
                left
                autoFocus
                w="100%"
                name={`${option}.title`}
                component={this.renderInput}
                placeholder={`Option ${index + 1}`}
                style={{
                  paddingLeft: 7,
                  fontSize: 19,
                  color: this.props.colors.textColor
                }}
                onChange={this.onChangeOptions(index)}
                value={this.state.options[index]}
              />
            </View>
          );
        })}
        {this.renderAddOption(fields)}
      </View>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : -200}
        style={{ flex: 1, backgroundColor: this.props.colors.whiteBlack }}
      >
        <SafeAreaView style={{ flex: 1, alignItems: "flex-start" }}>
          {this.renderQuestion()}
          <ScrollView>
            <FieldArray
              name="options"
              component={this.renderOptions}
              style={{ flex: 1 }}
            />
          </ScrollView>
          <Button
            shadow
            style={[
              styles.publishButton,
              { backgroundColor: this.props.colors.headerColor }
            ]}
            onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
          >
            <Text semibold white center>
              Publish
            </Text>
          </Button>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  publishButton: {
    width: "95%",
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center"
  },
  input: {
    borderRadius: 0,
    borderWidth: 0
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%"
  }
});

const mapStateToProps = state => {
  return {
    colors: state.theme.colors
  };
};
let form = reduxForm({ form: "createPoll" })(CreatePoll);
export default connect(mapStateToProps)(form);
