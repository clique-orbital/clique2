import React from "react";
import { Icon } from "react-native-elements";

const MyIcon = props => {
  const { name, color, size, style, type = "ionicon" } = props;
  return (
    <Icon name={name} size={size} color={color} iconStyle={style} type={type} />
  );
};

export default MyIcon;
