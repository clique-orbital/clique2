import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import { connect } from "react-redux";

class PersonalCalendar extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Calendar" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  render() {}
}

const CalendarStack = createStackNavigator({
  Main: PersonalCalendar
});

const mapStateToProps = state => {};

export default connect(
  mapStateToProps,
  {}
)(CalendarStack);
