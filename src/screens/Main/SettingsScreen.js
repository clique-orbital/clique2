import React from "react";
import { Text } from "react-native";
import { SafeAreaView, createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Settings" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  render() {
    return (
      <SafeAreaView>
        <Text>This is the settings screen!</Text>
      </SafeAreaView>
    );
  }
}

const SettingsStack = createStackNavigator({
  Main: SettingsScreen
});

export default SettingsStack;
