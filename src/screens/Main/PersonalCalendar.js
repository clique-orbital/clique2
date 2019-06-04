import React from "react";
import { Text } from "react-native";
import { SafeAreaView, createStackNavigator } from "react-navigation";
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
      <SafeAreaView>
        <Text>This is the calendar screen!</Text>
      </SafeAreaView>
    );
  }
}

const CalendarStack = createStackNavigator({
  Main: PersonalCalendar
});

export default CalendarStack;
