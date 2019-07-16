import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";
import { connect } from "react-redux"


class NotificationsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <HeaderTitle title="Notifications" />,
      headerStyle: {
        backgroundColor: cliqueBlue
      },
      headerStyle: {
        backgroundColor: (navigation.state.params || {}).backgroundColor || cliqueBlue
      }
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      backgroundColor: this.props.colors.main,
    })
  }

  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>This is the notifications screen!</Text>
        {/* <TouchableOpacity style={{ backgroundColor: "black", color: "white", height: 50 }} onPress={this.handlePress}><Text style={{ color: "white" }}>Send Message</Text></TouchableOpacity> */}
      </View>
    );
  }
}

// const NotificationsStack = createStackNavigator({
//   Main: NotificationsScreen
// });


const mapStateToProps = state => {
  return {
    colors: state.theme.colors
  }
}
export default connect(mapStateToProps)(NotificationsScreen);
// export default NotificationsStack;


