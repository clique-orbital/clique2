import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import Text from "./Text";
import MyIcon from "./MyIcon";

// props: title, value
export default class MyCheckBox extends React.Component {
  state = {
    checked: false,
    value: this.props.value,
    name: "ios-radio-button-off",
    color: "grey"
  };

  check = () => {
    this.setState(prevState => {
      const checked = !prevState.checked;
      let name;
      let color;
      if (checked) {
        this.props.onChange(this.state.value);
        name = "ios-checkmark-circle";
        color = "#65c681";
        this.props.callback(true);
      } else {
        this.props.onChange("");
        name = "ios-radio-button-off";
        color = "grey";
        this.props.callback(false);
      }
      return { ...prevState, checked, color, name };
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this.check} style={styles.row}>
        <Text black style={[styles.text, { color: this.props.textColor }]}>
          {this.props.title}
        </Text>
        <MyIcon
          name={this.state.name}
          color={this.state.color}
          size={25}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  text: {
    paddingLeft: "5%",
    fontSize: 18,
    left: "5%"
  },
  icon: {
    // margin: 0
  }
});
