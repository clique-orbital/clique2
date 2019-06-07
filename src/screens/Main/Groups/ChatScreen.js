import React, { Component } from "react";
import { SafeAreaView, Text, View, TextInput, Dimensions, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import firebase from "react-native-firebase";

export default class ChatScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
          uid: firebase.auth().currentUser.uid,
          groupID: this.props.navigation.groupID,
          textMessage: '',
          messages: []
      }
      this.convertTime = this.convertTime.bind(this);
      this.sendMessage = this.sendMessage.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }
  
  messagesRef = firebase.database().ref('messages');

  static navigationOptions = ({ navigation }) => {
    const { groupName } =  navigation.getParam("group");
    return {
      title: groupName,
    };
  };

  componentWillMount() {
      this.messagesRef.child(`${this.state.groupID}`).on('child_added', snapshot => {
        this.setState(prevState => {
          return {
            ...prevState,
            messages: [...prevState.messages, snapshot.val()]
          }
        })
      })
  }

  handleChange = key => val => {
    this.setState({
      [key]: val
    });
  };

  convertTime = time => {
      let d = new Date(time);
      let c = new Date();
      let result = (d.getHours < 10 ? 0 : '') + d.getHours() + ":";
      result += (d.getMinutes < 10 ? '0' : '') + d.getMinutes();
      if(c.getDay() !== d.getDay()) {
          result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
      }
      return result;
    }

  sendMessage = async () => {
      if(this.state.textMessage.length > 0) {
          let msgID = this.messagesRef.child(`${this.state.groupID}`).push().key;
          let message = {
              message: this.state.textMessage,
              time: firebase.database.ServerValue.TIMESTAMP,
              from: this.state.uid
          }
          this.messagesRef.child(`${this.state.groupID}/${msgID}`).set(message);
          this.setState(prevState => { 
            return {
              ...prevState,
              textMessage: ''
            }
          })
        }
  };

  renderRow = ({ item }) => {
    return(
        <View style={{
            flexDirection:"row",
            justifyContent: 'space-between',
            width:"60%",
            alignSelf: item.from === this.state.uid ? 'flex-end' : 'flex-start',
            backgroundColor: item.from === this.state.uid ? '#3a8cbc' : '#134782',
            borderRadius: 20,
            marginBottom: 10,
            paddingLeft: 5,
        }}>
            <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
                {item.message}
            </Text>
            <View style={{justifyContent: 'flex-end'}}>
                <Text style={{color:'#eee', paddingRight: 13, paddingBottom: 7, fontSize: 10}}>
                    {this.convertTime(item.time)}
                </Text>
            </View>
        </View>
        
    )
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <KeyboardAvoidingView behavior="padding">
        <SafeAreaView style={styles.container}>
          <FlatList
              style={{padding:10, height: height * 0.8}}
              data={this.state.messageList}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={styles.chatInput}
                  value={this.state.textMessage}
                  onChangeText={this.handleChange("textMessage")}
                  placeholder="Write a message"
                />
                <TouchableOpacity onPress={this.sendMessage}>
                  <Text style={styles.sendBtn}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    justifyContent: "flex-end",
  },
  chatInput: {
    borderWidth: 1,
    borderRadius: 7,
    width: '80%',
    padding: 10,
    margin: 8,
    color: 'black',
    borderColor: 'black'
  },
  sendBtn: {
    color: '#1d73d6',
    fontSize: 20,
  }
})

// import React from "react";
// import { View, Text } from "react-native";
// import { GiftedChat } from "react-native-gifted-chat";
// import firebase from "react-native-firebase";
// import HeaderTitle from "../../../components/HeaderTitle";
// import cliqueBlue from "../../../assets/constants";

// class ChatScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       messages: []
//     }
//   }

//   static navigationOptions = ({ navigation }) => {
//     return {
//       headerTitle: (
//         <HeaderTitle title={navigation.getParam("username", "User")} />
//       )
//     };
//   };

//   componentWillMount() {
//     const { navigation } = this.props;
//     const group = navigation.getParam('group');
//     console.log(group.groupName);

//     // firebase.database().ref('messages').child(User.phoneNumber).child(this.state.person.phoneNumber)
//     // .on("child_added", (value)=> {
//     //     this.setState((prevState) => {
//     //         return {
//     //             messageList: [...prevState.messageList, value.val()]
//     //         }
//     //     })
//     // })
//   }

//   onSend(messages = []) {

//     // this.setState(previousState => ({
//     //   messages: GiftedChat.append(previousState.messages, messages)
//     // }));
//   }

//   render() {
//     return (
//       <GiftedChat
//         messages={this.state.messages}
//         onSend={messages => this.onSend(messages)}
//         user={{
//           _id: 1
//         }}
//       />
//     );
//   }
// }

// export default ChatScreen;


