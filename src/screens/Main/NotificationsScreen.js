import React from "react";
import { Text } from "react-native";
import { SafeAreaView, createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";

class NotificationsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Notifications" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  render() {
    return (
      <SafeAreaView>
        <Text>This is the notifications screen!</Text>
      </SafeAreaView>
    );
  }
}

const NotificationsStack = createStackNavigator({
  Main: NotificationsScreen
});

export default NotificationsStack;
