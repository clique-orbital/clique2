import React, { Component } from "react";
import { SafeAreaView, Text, View, TextInput, Dimensions, StyleSheet, KeyboardAvoidingView, Keyboard, Platform } from "react-native";
import { TouchableOpacity, FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { fetchedConversation, fetchNewMessage } from "../../../store/actions/messages"
import _ from "lodash";

class ChatScreen extends Component {
  constructor(props) {
      // this.props has { uid }
      super(props);
      this.state = {
          uid: this.props.uid,
          groupID: this.props.navigation.getParam("group").groupID,
          textMessage: '',
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
    const groupID = this.state.groupID;
    this.messagesRef.child(`${groupID}`).on('value', snapshot => {
      this.props.dispatch(fetchedConversation(groupID, _.sortBy(_.values(snapshot.val()), 'timestamp')));
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
        <View style={{
            flexDirection:"row",
            justifyContent: 'space-between',
            width:"auto",
            alignSelf: item.from === this.state.uid ? 'flex-end' : 'flex-start',
            backgroundColor: item.from === this.state.uid ? '#3a8cbc' : '#134782',
            borderRadius: 20,
            marginBottom: 8,
            paddingLeft: 5,
            marginLeft: item.from === this.state.uid ? 40 : 0,
            marginRight: item.from === this.state.uid ? 0 : 40,
        }}>
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
    let { height, width } = Dimensions.get('window');
    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === 'ios' ? 64: 0} style={{ flex: 1 }}>
        <SafeAreaView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <FlatList
              inverted
              style={{padding:10, height: height * 0.8}}
              data={_.reverse(this.props.conversation.slice())}
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
  return {
    uid: state.authReducer.user.uid,
    conversation: state.messagesReducer[groupID] || [],
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
  }
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


