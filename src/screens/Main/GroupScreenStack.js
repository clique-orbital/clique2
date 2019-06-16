import { createStackNavigator } from "react-navigation";
import { cliqueBlue } from "../../assets/constants";
import CreateGroups from "./Groups/CreateGroups";
import ChatScreen from "./Groups/ChatScreen";
import GroupDetails from "./Groups/GroupDetails";
import GroupScreen from "./GroupScreen";
import CreateEvents from "./Groups/CreateEvents"


const GroupScreenStack = createStackNavigator(
  {
    Main: GroupScreen,
    CreateGroups: CreateGroups,
    Chat: ChatScreen,
    GroupDetails: GroupDetails,
    CreateEvents: CreateEvents,

  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: cliqueBlue,
      },
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