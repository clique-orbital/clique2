import { createStackNavigator } from "react-navigation";
import { cliqueBlue } from "../../assets/constants";
import CreateGroups from "./Groups/CreateGroups";
import ChatScreen from "./Groups/ChatScreen";
import GroupDetails from "./Groups/GroupDetails";
import GroupScreen from "./GroupScreen";
import CreateEvents from "./Groups/CreateEvents";
import CalendarScreen from "./Groups/CalendarScreen";
import GroupInformation from "./Groups/GroupInformation";
import AddMembers from "./Groups/AddMembers";

const GroupScreenStack = createStackNavigator(
  {
    Main: GroupScreen,
    CreateGroups,
    Chat: ChatScreen,
    GroupDetails,
    GroupCalendar: CalendarScreen,
    CreateEvents,
    GroupInformation,
    AddMembers
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

GroupScreenStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

export default GroupScreenStack;
