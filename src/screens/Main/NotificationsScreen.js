import React from "react";
import { View, Text, Image } from "react-native";
import { createStackNavigator } from "react-navigation";
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
      <View>
        <Text>This is the notifications screen!</Text>
      </View>
    );
  }
}

const NotificationsStack = createStackNavigator({
  Main: NotificationsScreen
});

export default NotificationsStack;
