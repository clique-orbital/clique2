import React, { Component } from "react";
import { BottomTabBar } from "react-navigation-tabs";
import { connect } from "react-redux";

class TabBarComponent extends Component {
  render() {
    const newProps = Object.assign({}, this.props);
    newProps.activeTintColor = this.props.colors.textColor || "#fff";
    return (
      <BottomTabBar {...newProps} style={{ backgroundColor: this.props.colors.lightMain || "#fff" }} />
    )
  }
}

const mapStateToProps = state => {
  return {
    colors: state.theme.colors
  }
}
export default connect(mapStateToProps)(TabBarComponent);