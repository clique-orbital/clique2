import React, { Component } from "react";
import Modal from "react-native-modal";
import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import { togglePollModal } from "../store/actions/pollModal";
import { cliqueBlue } from "../assets/constants";

class PollModal extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.renderPolls = this.renderPolls.bind(this);
  }

  hideModal() {
    this.props.dispatch(togglePollModal(false));
  }

  // map each result to this UI
  renderPolls() {
    return (
      <View>
        <View style={{ height: 20, alignItems: "center" }}>
          <View style={{ width: "75%", marginLeft: 10 }}>
            <Text style={{ color: cliqueBlue }}>(Option 1)</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "12.5%", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: "#1965BC", padding: 1 }}>
              <View style={{ backgroundColor: true ? "#1965BC" : "#fff", flex: 1, borderRadius: 10 }} />
            </TouchableOpacity>
          </View>
          <View style={{ height: 20, padding: 1, borderRadius: 10, width: "75%", borderWidth: 2, borderColor: "#1965BC", flexDirection: "column", justifyContent: "flex-start" }}>
            <View style={{ backgroundColor: "#1965BC", flex: 1, borderRadius: 10, width: "100%" }} />
          </View>
          <View style={{ width: "12.5%", justifyContent: "center", alignItems: "center", height: 20 }}>
            <Text style={{ fontSize: 21, color: "#1964BC", fontWeight: "bold", marginBottom: 0 }}>10</Text>
          </View>
        </View>
      </View>

    )
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
          <SafeAreaView style={{ height: "70%", width: '100%', backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
            <TouchableOpacity
              style={{ height: 20, width: 20, position: "relative", top: "5%", left: "7%", zIndex: 1 }}
              onPress={this.hideModal}
            >
              <Image
                source={require("../assets/x.png")}
                style={{
                  height: 20,
                  width: 20
                }}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "center", justifyContent: "center", marginTop: 30, flex: 1 }}>
                <Text style={{ fontSize: 30, color: cliqueBlue }}>(Title)</Text>
              </View>
              <View style={{ flex: 5 }}>
                {this.renderPolls()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    visibility: state.pollModal.modalVisibility
  }
}
export default connect(mapStateToProps)(PollModal);