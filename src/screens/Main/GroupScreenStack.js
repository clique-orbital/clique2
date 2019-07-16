import { createStackNavigator } from "react-navigation";
import CreateGroups from "./Groups/CreateGroups";
import ChatScreen from "./Groups/ChatScreen";
import GroupDetails from "./Groups/GroupDetails";
import GroupScreen from "./GroupScreen";
import CreateEvents from "./Groups/CreateEvents";
import CalendarScreen from "./Groups/CalendarScreen";
import GroupInformation from "./Groups/GroupInformation";
import AddMembers from "./Groups/AddMembers";
import CreatePoll from "./Groups/CreatePoll";
import MyHeader from "../../components/MyHeader"
import React from "react";

const GroupScreenStack = createStackNavigator(
  {
    Main: GroupScreen,
    CreateGroups,
    Chat: ChatScreen,
    GroupDetails,
    GroupCalendar: CalendarScreen,
    CreateEvents,
    GroupInformation,
    AddMembers,
    CreatePoll
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      header: props => <MyHeader {...props} />,
      headerStyle: {
        // backgroundColor: cliqueBlue
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

const mapStateToProps = state => {
  return {
    backgroundColor: state.theme.main || "#000"
  }
}

// export default connect(mapStateToProps)(GroupScreenStack);
export default GroupScreenStack;
