import React from "react";
import { Icon } from "react-native-elements";

const MyIcon = props => {
  const { name, color, size } = props;
  return <Icon name={name} size={size} color={color} type="ionicon" />;
};

export default MyIcon;
