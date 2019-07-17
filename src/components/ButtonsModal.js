import React from "react";
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import MyIcon from "./MyIcon";
import { cliqueBlue } from "../assets/constants";

class ButtonsModal extends React.Component {
  state = { visible: this.props.visible };

  renderIcon = name => {
    const { groupID, uid, username, navigation } = this.props;

    return (
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          this.props.setFalse();
          name === "poll"
            ? navigation.navigate("CreatePoll", {
              groupID,
              uid,
              username
            })
            : navigation.navigate("CreateEvents", { groupID });
        }}
      >
        <MyIcon name={name} type="material" size={28} color="white" />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          isVisible={this.props.visible}
          swipeDirection="down"
          onSwipeComplete={this.props.setFalse}
          onBackdropPress={this.props.setFalse}
          onBackButtonPress={this.props.setFalse}
          backdropOpacity={0.3}
          avoidKeyboard={true}
          style={{
            width: "100%",
            margin: 0,
            justifyContent: "flex-end",
          }}
        >
          <SafeAreaView
            style={{
              flexDirection: "row",
              height: 50,
              width: 100,
              backgroundColor: this.props.theme.myMsgBubble,
              borderRadius: 10,
              bottom: 40 + this.props.heightOfInput,
              left: 5
            }}
          >
            {this.renderIcon("poll")}
            {this.renderIcon("event-note")}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: cliqueBlue,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderColor: "grey",
    borderWidth: StyleSheet.hairlineWidth
  }
});

export default ButtonsModal;
