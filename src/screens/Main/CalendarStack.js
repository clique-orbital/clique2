import { createStackNavigator } from "react-navigation";
import PersonalCalendar from "./PersonalCalendar";
import React from "react";
import MyHeader from "../../components/MyHeader";

const CalendarStack = createStackNavigator(
  {
    Main: PersonalCalendar,
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      header: props => <MyHeader {...props} />,
    }
  }
);

export default CalendarStack;
