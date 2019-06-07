import React from "react";
import { View, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import HeaderTitle from "../../../components/HeaderTitle";
import cliqueBlue from "../../../assets/constants";

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <HeaderTitle title={navigation.getParam("username", "User")} />
      )
    };
  };

  componentWillMount() {
    const { navigation } = this.props;
    const groupID = navigation.getParam('groudID');
    firebase.database().ref('messages').child(User.phoneNumber).child(this.state.person.phoneNumber)
    .on("child_added", (value)=> {
        this.setState((prevState) => {
            return {
                messageList: [...prevState.messageList, value.val()]
            }
        })
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}

export default ChatScreen;
