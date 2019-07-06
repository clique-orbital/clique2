import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm } from "redux-form";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import theme from "../../../assets/theme";
import MyIcon from "../../../components/MyIcon";

// navigation props: groupID

class CreatePoll extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <View style={{ flexDirection: "row" }}>
          <MyIcon name="poll" type="material" size={28} color="white" />
          <Text h2 semibold white style={{ paddingHorizontal: 5 }}>
            Poll
          </Text>
        </View>
      )
    };
  };

  renderInput = props => {
    return <Input {...props.input} style={props.style} {...props} />;
  };

  handleSubmit = formValues => {
    console.log(formValues);
  };

  renderQuestion = width => {
    return (
      <View style={styles.border}>
        <Field
          name="question"
          left
          placeholder="Question"
          component={this.renderInput}
          style={[
            styles.input,
            {
              fontSize: 22,
              paddingLeft: 30,
              paddingTop: 10,
              fontWeight: "400"
            }
          ]}
          w={width}
        />
      </View>
    );
  };

  renderAddOption = fields => {
    return (
      <TouchableOpacity onPress={() => fields.push({})}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MyIcon
            name="add"
            type="material"
            size={30}
            color={theme.colors.light_chat_background}
          />
          <Text h2 center color={theme.colors.light_chat_background}>
            Add option
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderOptions = ({ fields }) => {
    return (
      <View style={{ marginTop: 20, flex: 1, marginHorizontal: 20 }}>
        {fields.map((option, index) => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
              key={index}
            >
              <MyIcon
                name="radio-button-unchecked"
                type="material"
                size={15}
                color="black"
              />
              <Field
                left
                autoFocus
                w="100%"
                name={`Option ${index + 1}`}
                component={this.renderInput}
                placeholder={`Option ${index + 1}`}
                style={{ paddingLeft: 10, fontSize: 19 }}
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
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        {this.renderQuestion()}
        <FieldArray
          name="options"
          component={this.renderOptions}
          ref={this.fieldArray}
          style={{ flex: 1 }}
        />
        <Button
          shadow
          style={[styles.publishButton, { marginTop: 20 }]}
          onPress={this.props.handleSubmit(this.handleSubmit.bind(this))}
        >
          <Text semibold white center>
            Publish
          </Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  publishButton: {
    backgroundColor: theme.colors.cliqueBlue,
    width: "70%",
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center"
  },
  input: {
    borderRadius: 0,
    borderWidth: 0
  },
  border: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%"
  }
});

let form = reduxForm({ form: "createPoll" })(CreatePoll);
export default connect()(form);
