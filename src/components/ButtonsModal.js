import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import MyIcon from "./MyIcon";
import { cliqueBlue } from "../assets/constants";

class ButtonsModal extends React.Component {
  state = { visible: this.props.visible };

  renderIcon = name => {
    const { groupID, uid, username } = this.props;

    return (
      <TouchableOpacity
        style={styles.icon}
        onPress={() =>
          name === "poll"
            ? this.props.navigation.navigate("CreatePoll", {
                groupID,
                uid,
                username
              })
            : this.props.navigation.navigate("CreateEvents", { groupID })
        }
      >
        <MyIcon name={name} type="material" size={28} color="white" />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={this.props.visible}
          swipeDirection="down"
          swipeThreshold={200}
          onSwipeComplete={this.props.setFalse}
          style={{ width: "100%", margin: 0, justifyContent: "flex-end" }}
        >
          <View style={StyleSheet.modal}>
            {this.renderIcon("poll")}
            {this.renderIcon("event-note")}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: { flexDirection: "row", flex: 1 },
  icon: {
    backgroundColor: cliqueBlue,
    height: 40,
    width: 40,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ButtonsModal;
