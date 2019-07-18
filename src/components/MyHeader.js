import React from "react";
import { Header } from "react-navigation-stack";
import { connect } from "react-redux";

class MyHeader extends React.Component {

  render() {
    const newProps = Object.assign({}, this.props);
    const newHeaderStyle = Object.assign({}, newProps.scene.descriptor.options.headerStyle);
    newHeaderStyle.backgroundColor = this.props.colors.headerColor;
    newProps.scene.descriptor.options.headerStyle = newHeaderStyle;

    return (
      <Header {...newProps} />
    )
  }
}

const mapStateToProp = state => {
  return {
    colors: state.theme.colors
  }
}

export default connect(mapStateToProp)(MyHeader);