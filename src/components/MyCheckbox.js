import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import MyIcon from "../components/MyIcon";
import cliqueBlue from "../assets/constants";

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
        color = "#134782";
      } else {
        this.props.onChange("");
        name = "ios-radio-button-off";
        color = "grey";
      }
      return { ...prevState, checked, color, name };
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this.check} style={styles.row}>
        <Text style={styles.text}>{this.props.title}</Text>
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
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#eee",
    borderBottomWidth: 1
  },
  text: {
    paddingLeft: "5%",
    paddingTop: "3%",
    fontSize: 18,
    left: "5%"
  },
  icon: {
    paddingRight: "5%",
    paddingTop: "3%"
  }
});

/**
 * <CheckBox
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
 */
