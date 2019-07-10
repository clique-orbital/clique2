import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { togglePollModal } from "../store/actions/pollModal";

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
      <View
        style={{
          marginHorizontal: 80,
          backgroundColor: "#fff",
          borderRadius: 15,
          marginVertical: 5
        }}
      >
        <View style={{ padding: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 23 }}>
            {this.props.poll.question}
          </Text>
        </View>
        <View style={{ padding: 10 }}>
          <TouchableOpacity onPress={this.showPollModal}>
            <Text style={{ textAlign: "center" }}>See Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect()(PollMessageBubble);
