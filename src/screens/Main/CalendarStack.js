import { createStackNavigator } from "react-navigation";
import { cliqueBlue } from "../../assets/constants";
import PersonalCalendar from "./PersonalCalendar";

const CalendarStack = createStackNavigator(
  {
    Main: PersonalCalendar,
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: cliqueBlue
      }
    }
  }
);

export default CalendarStack;
