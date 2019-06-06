import React from "react";
import { Text, View } from "react-native";
import { CheckBox } from "react-native-elements";

import cliqueBlue from "../assets/constants";

export default class MyCheckBox extends React.Component {
  state = { checked: false, value: this.props.value };

  check = () => {
    this.setState(prevState => {
      const newState = !prevState.checked;
      if (newState) {
        this.props.onChange(this.state.value);
      } else {
        this.props.onChange("");
      }
      return { checked: newState };
    });
  };

  render() {
    return (
      <CheckBox
        {...this.props}
        title={this.props.title}
        left
        iconRight
        iconType="ionicon"
        uncheckedIcon="ios-radio-button-off"
        checkedColor={cliqueBlue}
        checkedIcon="ios-checkmark-circle"
        checked={this.state.checked}
        onPress={this.check}
      />
    );
  }
}
