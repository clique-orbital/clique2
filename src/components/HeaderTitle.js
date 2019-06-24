import React from "react";
import Text from "./Text";

const HeaderTitle = props => {
  return (
    <Text
      semibold
      h2
      white
      left
      style={{
        marginLeft: 20
      }}
    >
      {props.title}
    </Text>
  );
};

export default HeaderTitle;
