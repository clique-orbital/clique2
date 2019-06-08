import { createStackNavigator } from "react-navigation";
import { cliqueBlue } from "../../assets/constants";
import CreateGroups from "./Groups/CreateGroups";
import ChatScreen from "./Groups/ChatScreen";
import GroupDetails from "./Groups/GroupDetails";
import GroupScreen from "./GroupScreen";


const GroupScreenStack = createStackNavigator(
    {
      Main: GroupScreen,
      Create: CreateGroups,
      Chat: ChatScreen,
      GroupDetails: GroupDetails
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