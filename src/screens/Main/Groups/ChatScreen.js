import React, { Component } from "react";
import { SafeAreaView, Text, View, TextInput, Dimensions, StyleSheet, KeyboardAvoidingView, Keyboard, Platform } from "react-native";
import { TouchableOpacity, FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { fetchedConversation } from "../../../store/actions/messages"
import MyIcon from "../../../components/MyIcon";
import _ from "lodash";

class ChatScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
          uid: this.props.uid,
          groupID: this.props.navigation.getParam("group").groupID,
          textMessage: '',
          prevDay: (new Date()).getDay(),
      }
      this.convertTime = this.convertTime.bind(this);
      this.sendMessage = this.sendMessage.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }
  
  messagesRef = firebase.database().ref('messages');

  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: navigation.getParam("group").groupName,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate("CreateEvents")}>
          <MyIcon
            name="ios-add"
            size={32}
            color="white"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      )
    }
  };

  componentWillMount() {
    const groupID = this.state.groupID;
    this.messagesRef.child(`${groupID}`).on('value', snapshot => {
      this.props.dispatch(fetchedConversation(groupID, _.sortBy(_.values(snapshot.val()), 'timestamp')));
    })
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.scrollToBottom
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.scrollToBottom
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  scrollToBottom = (contentHeight, contentWidth) => {
    this.refs.messageList.scrollToEnd({animated: true})
  }

  handleChange = key => val => {
    this.setState({
      [key]: val
    });
  };

  convertTime = time => {
      let d = new Date(time);
      let c = new Date();
      let result = (d.getHours() < 10 ? 0 : '') + d.getHours() + ":";
      result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
      return result;
  }

  // sameDay = (dateOfMessage, message) => {
  //   console.log("props date = " + this.props.prevDate);
  //   if(dateOfMessage === this.props.prevDate){
  //     console.log("in true. day = " + dateOfMessage + ' ' + message)
  //     return true;
  //   }
  //   console.log('in false. day = ' + dateOfMessage + ' ' + message);
  //   this.props.dispatch(changePrevDate(this.state.groupID, dateOfMessage));
  //   return false;
  // }

  sendMessage = async () => {
      this.setState({textMessage: this.textInput});
      const groupID = this.state.groupID;
      if(this.state.textMessage.length > 0) {
        let msgID = this.messagesRef.child(`${groupID}`).push().key;
        let message = {
            message: this.state.textMessage,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            from: this.state.uid
        }
        this.messagesRef.child(`${groupID}`).child(`${msgID}`).set(message);
        this.setState({ textMessage: ''})
      }
  };

  renderRow = ({ item }) => {
    return(
      <View style={item.from === this.props.uid ? styles.myMessageBubble : styles.yourMessageBubble}>
        <View style={{flexWrap: "wrap"}}>
          <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
            {item.message}
          </Text>
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          <Text style={{color:'#eee', paddingRight: 13, paddingBottom: 7, fontSize: 10}}>
            {this.convertTime(item.timestamp)}
          </Text>
        </View>
      </View>
    )
  }


  render() {
    let { height } = Dimensions.get('window');
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 85 : 0} style={{ flex: 1 }}>
        <SafeAreaView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <FlatList
              ref="messageList"
              onContentSizeChange={this.scrollToBottom}
              style={{padding: 10, height: height * 0.8}}
              data={this.props.conversation.slice()}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.chatBox}>
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
            <View style={{flex: 1}}/>
          </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { groupID } = ownProps.navigation.getParam("group");
  const stateOfGroup = state.messagesReducer[groupID] || {};
  return {
    uid: state.authReducer.user.uid,
    conversation: stateOfGroup.messages || [],
  }
}

export default connect(mapStateToProps)(ChatScreen);

const styles = StyleSheet.create({
  inner:{
    justifyContent: "flex-end",
  },
  chatBox:{
    flexDirection: "row", 
    alignItems: "center" ,
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
  },
  yourMessageBubble: {
    flexDirection:"row",
    justifyContent: 'space-between',
    width:"auto",
    alignSelf: 'flex-start',
    backgroundColor: '#134782',
    borderRadius: 20,
    marginBottom: 8,
    paddingLeft: 5,
    marginLeft: 0,
    marginRight: 40,
  },
  myMessageBubble: {
    flexDirection:"row",
    justifyContent: 'space-between',
    width:"auto",
    alignSelf: 'flex-end',
    backgroundColor: '#3a8cbc',
    borderRadius: 20,
    marginBottom: 8,
    paddingLeft: 5,
    marginLeft: 40,
    marginRight: 0,
  },
})

// import React from "react";
// import { GiftedChat } from "react-native-gifted-chat";
// import firebase from "react-native-firebase";
// import { fetchedConversation } from "../../../store/actions/messages"
// import { connect } from "react-redux";

// class ChatScreen extends React.Component {
//   constructor(props) {
//       // this.props has { uid }
//       super(props);
//       this.state = {
//           uid: this.props.uid,
//           groupID: this.props.navigation.getParam("group").groupID,
//           textMessage: '',
//       }
//   }

//   messagesRef = firebase.database().ref('messages');


//   static navigationOptions = ({ navigation }) => {
//     const { groupName } =  navigation.getParam("group");
//     return {
//       title: groupName,
//     };
//   };

//   componentWillMount() {
//     const groupID = this.state.groupID;
//     this.messagesRef.child(`${groupID}`).on('child_added', snapshot => {
//       this.props.dispatch(fetchedConversation(groupID, snapshot.val()));
//     })
//   }

//   onSend = async (messages = []) => {
//     if(messages.length > 0) {
//       // console.log(messages);
//       this.messagesRef.child(`${this.state.groupID}`).child(`${messages[0]._id}`).set(messages);
//     }
//   }

//   render() {
//     console.log(this.props.conversation);
//     return (
//       <GiftedChat
//         messages={this.props.conversation}
//         onSend={(message) => this.onSend(message)}
//         user={{
//           _id: this.props.uid,
//           name: this.props.name,
//           avatar: this.props.avatar
//         }}
//       />
//     );
//   }
// }

// const mapStateToProps = (state, ownProps) => {
//   const { groupID } = ownProps.navigation.getParam("group");
//   return {
//     uid: state.authReducer.user.uid,
//     name: state.authReducer.user.displayName,
//     avatar: state.authReducer.user.photoURL,
//     conversation: state.messagesReducer[groupID],
//   }
// }

// export default connect(mapStateToProps)(ChatScreen);


