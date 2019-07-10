import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";

class NotificationsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Notifications" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  handlePress = () => {
    // let remoteMsg = firebase.messaging().RemoteMessage.setMessageId("testing");
    // remoteMsg = remoteMsg.setTo("dctuzVhN6Nw:APA91bHAI4_TGAG_ptwzswAGfe5zx_6w79mrYx_RUcMsLEGI8TNkSHqc0P5fLr89uB4brLlS7bAP2HiFxHm_Ss4SaYWEf8Cn5MNTQQh8XdPMv74fSEUv6G7cQlyDynjRGNw1_DGkULzm@gcm.googleapis.com")
    // remoteMsg = remoteMsg.setDate({ a: 'b' })
    // firebase.messaging().sendMessage(new RemoteMessage()).then(() => console.log("sent remote message"));

  }

  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>This is the notifications screen!</Text>
        {/* <TouchableOpacity style={{ backgroundColor: "black", color: "white" }} onPress={this.handlePress}><Text style={{ color: "white" }}>Send Message</Text></TouchableOpacity> */}
      </View>
    );
  }
}

const NotificationsStack = createStackNavigator({
  Main: NotificationsScreen
});

export default NotificationsStack;
