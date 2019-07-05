import React from "react";
import { View, Text } from "react-native";
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
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>This is the notifications screen!</Text>
      </View>
    );
  }
}

const NotificationsStack = createStackNavigator({
  Main: NotificationsScreen
});

export default NotificationsStack;
