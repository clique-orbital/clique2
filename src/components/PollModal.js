import React, { Component } from "react";
import Modal from "react-native-modal";
import { SafeAreaView, View, TouchableOpacity, FlatList } from "react-native";
import FastImage from "react-native-fast-image";
import Text from "../components/Text";
import { connect } from "react-redux";
import { togglePollModal, updatePoll } from "../store/actions/pollModal";
import { cliqueBlue } from "../assets/constants";
import theme from "../assets/theme";
import _ from "lodash";
import firebase from "react-native-firebase";

class PollModal extends Component {
  componentDidMount() {
    const groupID = this.props.poll.groupID;
    const msgID = this.props.poll.msgID;
  }

  hideModal = () => {
    this.props.dispatch(togglePollModal(false));
  };

  renderPolls = () => {
    return (
      <FlatList
        data={this.props.poll.options}
        renderItem={item => this.renderPoll(item)}
        keyExtractor={item => item.index}
      />
    );
  };

  toggle = async index => {
    const uid = firebase.auth().currentUser.uid;
    const groupID = this.props.poll.groupID;
    const msgID = this.props.poll.msgID;
    const ref = firebase
      .database()
      .ref(`messages/${groupID}/${msgID}/pollObject/options/${index}/agree`);
    ref
      .once("value", snapshot => {
        if (snapshot.val() === null || !snapshot.val().hasOwnProperty(uid)) {
          return ref.child(`${uid}`).set(true);
        } else {
          return ref.child(`${uid}`).remove();
        }
      })
      .then(() => {
        ref.parent.parent.parent.once("value", snapshot => {
          this.props.dispatch(updatePoll(snapshot.val()));
        });
      });
  };

  // map each result to this UI
  renderPoll(option) {
    const length = _.keys(option.item.agree).length;
    return (
      <View>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "75%", marginLeft: 10 }}>
            <Text color={theme.colors.cliqueBlue} h3 left>
              {option.item.title}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "12.5%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#1965BC",
                padding: 1
              }}
              onPress={() => this.toggle(option.index)}
            >
              <View
                style={{
                  backgroundColor: true ? "#1965BC" : "#fff",
                  flex: 1,
                  borderRadius: 10
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 20,
              padding: 1,
              borderRadius: 10,
              width: "75%",
              borderWidth: 2,
              borderColor: "#1965BC",
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
          >
            <View
              style={{
                backgroundColor: "#1965BC",
                flex: 1,
                borderRadius: 10,
                width: `${length * 10}%` // to be adjusted
              }}
            />
          </View>
          <View
            style={{
              width: "12.5%",
              justifyContent: "center",
              alignItems: "center",
              height: 20
            }}
          >
            <Text h3 color="#1964BC">
              {length}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={this.props.visibility}
          swipeDirection="down"
          swipeThreshold={200}
          onSwipeComplete={this.hideModal}
          backdropOpacity={0.5}
          style={{ width: "100%", margin: 0, justifyContent: "flex-end" }}
        >
          <SafeAreaView
            style={{
              height: "70%",
              width: "100%",
              backgroundColor: "#fff",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40
            }}
          >
            <TouchableOpacity
              style={{
                height: 20,
                width: 20,
                position: "relative",
                top: "5%",
                left: "7%",
                zIndex: 1
              }}
              onPress={this.hideModal}
            >
              <FastImage
                source={require("../assets/x.png")}
                style={{
                  height: 20,
                  width: 20
                }}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 30,
                  flex: 1
                }}
              >
                <Text style={{ fontSize: 30, color: cliqueBlue }}>
                  {this.props.poll.question}
                </Text>
              </View>
              <View style={{ flex: 5 }}>{this.renderPolls()}</View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { modalVisibility, poll } = state.pollModal;
  return {
    visibility: modalVisibility,
    poll
  };
};
export default connect(mapStateToProps)(PollModal);
