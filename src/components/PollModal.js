import React, { Component } from "react";
import Modal from "react-native-modal";
import { SafeAreaView, View, TouchableOpacity, FlatList } from "react-native";
import Text from "../components/Text";
import { connect } from "react-redux";
import { togglePollModal, updatePoll } from "../store/actions/pollModal";
import _ from "lodash";
import firebase from "react-native-firebase";
import MyIcon from "./MyIcon";

class PollModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIndex: [],
      voters: {}
    };
    this.popularVote = this.popularVote.bind(this);
    this.renderPoll = this.renderPoll.bind(this);
    this.renderVoters = this.renderVoters.bind(this);
    this.fetchVoters = this.fetchVoters.bind(this);
  }

  hideModal = () => {
    this.setState({
      showIndex: [],
      voters: {}
    });
    this.props.dispatch(togglePollModal(false));
  };

  renderPolls = highestVote => {
    return (
      <FlatList
        data={this.props.poll.options}
        renderItem={this.renderPoll(highestVote)}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
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
        return ref.parent.parent.parent.once("value", snapshot => {
          this.props.dispatch(updatePoll(snapshot.val()));
          this.fetchVoters(snapshot.val().options);
        });
      })
  };

  renderVoters = index => () => {
    if (this.state.showIndex.includes(index)) {
      this.setState(prevState => {
        return {
          showIndex: prevState.showIndex.filter(i => i !== index)
        };
      });
    } else {
      this.fetchVoters();
      this.setState(prevState => {
        return {
          showIndex: prevState.showIndex.concat([index])
        };
      });
    }
  };

  fetchVoters = (options = this.props.poll.options) => {
    const numOfOptions = options.length;
    let voters = {};
    for (let i = 0; i < numOfOptions; i++) {
      const usersUID = _.keys(options[i].agree);
      const users = usersUID.map(uid => this.props.group.users[uid]);
      voters[i] = users.join(", ");
    }
    this.setState({ voters });
  };

  // map each result to this UI
  renderPoll = highestVote => ({ item, index }) => {
    const length = _.size(item.agree);
    const usersThatAgreed = _.keys(item.agree);
    const userAgreed = usersThatAgreed.includes(this.props.uid);

    return (
      <View style={{ marginBottom: 15 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "75%", marginLeft: 10, marginBottom: 3 }}>
            <Text color={this.props.colors.pollItemTitle} h3 left>
              {item.title}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              width: "12.5%",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => this.toggle(index)}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: this.props.colors.pollBar,
                padding: 1
              }}
            >
              <View
                style={{
                  backgroundColor: userAgreed
                    ? this.props.colors.pollBar
                    : this.props.colors.lightMain,
                  flex: 1,
                  borderRadius: 10
                }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 20,
              padding: 1,
              borderRadius: 10,
              width: "75%",
              borderWidth: 2,
              borderColor: this.props.colors.pollBar,
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
            onPress={this.renderVoters(index)}
          >
            <View
              style={{
                backgroundColor: this.props.colors.pollBar,
                flex: 1,
                borderRadius: 10,
                width: length !== 0 ? `${(length / highestVote) * 100}%` : 14 // to be adjusted
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: "12.5%",
              justifyContent: "center",
              alignItems: "center",
              height: 20
            }}
          >
            <Text h3 color={this.props.colors.pollBar}>
              {length}
            </Text>
          </View>
        </View>
        {this.state.showIndex.includes(index) && (
          <View style={{ alignItems: "center" }}>
            <View style={{ width: "75%", marginLeft: 10, marginTop: 2 }}>
              <Text color="#87A4C6" h5 left>
                {this.state.voters[index]}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  popularVote = () => {
    const highestVote = this.props.poll.options
      .map(option => {
        return _.size(option.agree);
      })
      .reduce((option1, option2) => Math.max(option1, option2), 0);

    return highestVote;
  };

  render() {
    const highestVote = this.popularVote();

    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={this.props.visibility}
          onBackdropPress={this.hideModal}
          onBackButtonPress={this.hideModal}
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
              backgroundColor: this.props.colors.lightMain,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40
            }}
          >
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                position: "relative",
                top: "5%",
                left: "7%",
                zIndex: 1
              }}
              onPress={this.hideModal}
            >
              <MyIcon
                type="material"
                name="clear"
                size={28}
                color={this.props.colors.pollTitle}
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
                <Text
                  style={{ fontSize: 30, color: this.props.colors.pollTitle }}
                >
                  {this.props.poll.question}
                </Text>
              </View>
              <View style={{ flex: 5 }}>{this.renderPolls(highestVote)}</View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { modalVisibility } = state.pollModal;
  return {
    visibility: modalVisibility,
    poll: state.pollModal.poll,
    uid: state.authReducer.user.uid,
    colors: state.theme.colors
  };
};
export default connect(mapStateToProps)(PollModal);
