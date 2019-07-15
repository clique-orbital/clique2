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
      <View style={{ marginHorizontal: 50, backgroundColor: this.props.colors.pollMsgBottom, borderRadius: 15, marginVertical: 5 }}>
        <View style={{ padding: 10, backgroundColor: this.props.colors.pollMsgTop, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
          <Text style={{ textAlign: "center", fontSize: 23, color: "#fff" }}>
            {this.props.poll.question}
          </Text>
        </View>
        <View style={{ padding: 10 }}>
          <TouchableOpacity onPress={this.showPollModal}>
            <Text style={{ textAlign: "center", color: this.props.colors.textColor }}>See Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProp = state => {
  return {
    colors: state.theme.colors
  }
}

export default connect(mapStateToProp)(PollMessageBubble);
