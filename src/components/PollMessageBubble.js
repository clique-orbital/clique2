import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { togglePollModal } from "../store/actions/pollModal";
import theme from "../assets/theme";

class PollMessageBubble extends Component {
  constructor(props) {
    super(props);
    this.showPollModal = this.showPollModal.bind(this);
  }

  showPollModal = () => {
    this.props.dispatch(togglePollModal(true, this.props.poll));
  };

  render() {
    return (
      <View style={{ marginHorizontal: 50, backgroundColor: "#fff", borderRadius: 15, marginVertical: 5}}>
        <View style={{ padding: 10, backgroundColor: theme.colors.poll_blue, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
          <Text style={{ textAlign: "center", fontSize: 23, color: "#fff" }}>
            {this.props.poll.question}
          </Text>
        </View>
        <View style={{ padding: 10, }}>
          <TouchableOpacity onPress={this.showPollModal}>
            <Text style={{ textAlign: "center", color: theme.colors.poll_blue }}>See Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect()(PollMessageBubble);
