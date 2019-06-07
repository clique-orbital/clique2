import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";

class PersonalCalendar extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Calendar" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  render() {
    return (
      <View>
        <Text>This is the calendar screen!</Text>
      </View>
    );
  }
}

const CalendarStack = createStackNavigator({
  Main: PersonalCalendar
});

export default CalendarStack;
