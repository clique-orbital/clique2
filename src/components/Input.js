import React, { Component } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import Text from "../components/Text";
import Button from "../components/Button";
import theme from "../assets/theme";

export default class Input extends Component {
  state = {
    toggleSecure: false
  };

  renderLabel() {
    const { label, error } = this.props;

    return (
      <View style={{ flex: 0 }}>
        {label ? (
          <Text gray2={!error} accent={error}>
            {label}
          </Text>
        ) : null}
      </View>
    );
  }

  renderToggle() {
    const { secure, rightLabel } = this.props;
    const { toggleSecure } = this.state;

    if (!secure) return null;

    return (
      <Button
        style={styles.toggle}
        onPress={() => this.setState({ toggleSecure: !toggleSecure })}
      />
    );
  }

  renderRight() {
    const { rightLabel, rightStyle, onRightPress } = this.props;

    if (!rightLabel) return null;

    return (
      <Button
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
      >
        {rightLabel}
      </Button>
    );
  }

  render() {
    const {
      email,
      phone,
      number,
      secure,
      error,
      style,
      placeholder,
      value,
      h,
      w,
      left,
      ...props
    } = this.props;

    const { toggleSecure } = this.state;
    const isSecure = toggleSecure ? false : secure;

    const inputStyles = [
      styles.input,
      style,
      { height: h, width: w },
      left && { textAlign: "left" }
    ];

    const inputType = email
      ? "email-address"
      : number
        ? "numeric"
        : phone
          ? "phone-pad"
          : "default";

    return (
      <View style={{ flex: 0 }}>
        {this.renderLabel()}
        <TextInput
          underlineColorAndroid="transparent"
          style={inputStyles}
          secureTextEntry={isSecure}
          autoComplete="off"
          autoCapitalize="sentences"
          autoCorrect={false}
          keyboardType={inputType}
          placeholder={placeholder}
          value={value}
          {...props}
        />
        {this.renderToggle()}
        {this.renderRight()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderRadius: theme.sizes.radius,
    fontSize: theme.sizes.h3,
    fontWeight: "400",
    color: theme.colors.black,
    height: theme.sizes.base * 3,
    textAlign: "center"
  },
  toggle: {
    position: "absolute",
    alignItems: "flex-end",
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    top: theme.sizes.base,
    right: 0
  }
});
