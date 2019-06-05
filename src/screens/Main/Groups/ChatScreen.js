import React from "react";
import { View, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import HeaderTitle from "../../../components/HeaderTitle";
import cliqueBlue from "../../../assets/constants";

class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <HeaderTitle title={navigation.getParam("username", "User")} />
      )
    };
  };

  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello asdasdasd",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        }
      ]
    });
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
