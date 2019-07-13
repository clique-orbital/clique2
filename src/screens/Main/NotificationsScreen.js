import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";

class NotificationsScreen extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     count: 0,
  //   }
  //   this.handlePress = this.handlePress.bind(this);
  // }

  static navigationOptions = {
    headerTitle: <HeaderTitle title="Notifications" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  // handlePress = () => {
  //   this.setState(prevState => {
  //     return {
  //       count: prevState.count + 1
  //     }
  //   })
  //   const msgID = firebase.database().ref('messages/697fa456-8ae3-493d-972c-f6b207bb5136').push().key;
  //   let message = {
  //     messageType: "text",
  //     message: "hello" + this.state.count,
  //     timestamp: firebase.database.ServerValue.TIMESTAMP,
  //     sender: "KevIaRofz8g5o2GntC6nQQ18Ca33",
  //     username: "andyylam",
  //     firstMsgBySender: false
  //   };
  //   firebase.database().ref(`messages/697fa456-8ae3-493d-972c-f6b207bb5136/${msgID}`).set(message).then(() => {
  //     firebase.database().ref(`groups/697fa456-8ae3-493d-972c-f6b207bb5136/last_message`).set(message);
  //   });
  // }

  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>This is the notifications screen!</Text>
        {/* <TouchableOpacity style={{ backgroundColor: "black", color: "white", height: 50 }} onPress={this.handlePress}><Text style={{ color: "white" }}>Send Message</Text></TouchableOpacity> */}
      </View>
    );
  }
}

const NotificationsStack = createStackNavigator({
  Main: NotificationsScreen
});

export default NotificationsStack;
