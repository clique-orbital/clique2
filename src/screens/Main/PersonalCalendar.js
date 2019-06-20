import React from "react";
import { View, Text } from "react-native";
import { createSwitchNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import CalendarComponent from "../../components/CalendarComponent";

class PersonalCalendar extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Calendar" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  render() {
    return <CalendarComponent hasButton={false} />;
  }
}

const calendarStack = createSwitchNavigator({ Main: PersonalCalendar });

export default calendarStack;
