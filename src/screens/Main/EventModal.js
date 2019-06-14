import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { toggleEventModal } from "../../store/actions/eventModal";
import { cliqueBlue, getDate, getDay, getTime } from "../../assets/constants";
import { TouchableOpacity } from "react-native-gesture-handler";

class EventModal extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
  }

  hideModal() {
    this.props.dispatch(toggleEventModal(false, null));
  }

  renderRow = ({ item }) => {
    return (
      <View style={{ flex: 1, height: 30, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 18, color: cliqueBlue }}>{item}</Text>
      </View>
    )
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Modal isVisible={this.props.modalVisibility}
          swipeDirection='down'
          swipeThreshold={200}
          onSwipeComplete={this.hideModal}
          style={{ margin: 0 }}
        >
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={{ paddingTop: 30, marginLeft: 8, justifyContent: "flex-end" }}>
              <TouchableOpacity style={{ height: 50, width: 50 }} onPress={this.hideModal}>
                <Image
                  source={require("../../assets/x.png")}
                  style={{
                    resizeMode: "center",
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: 450, justifyContent: "space-between" }}>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", color: cliqueBlue, fontSize: 35 }}>{this.props.event.title}</Text>
              </View>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", marginHorizontal: 20 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.dateFormat}>{getDay(this.props.event.from)}</Text>
                  <Text style={styles.dateFormat}>{getDate(this.props.event.from)}</Text>
                  <Text style={styles.dateFormat}>{getTime(this.props.event.from)}</Text>
                </View>
                <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", width: 50 }}>
                  <Image source={require("../../assets/arrow.png")} style={{ resizeMode: "center", }} />
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.dateFormat}>{getDay(this.props.event.to)}</Text>
                  <Text style={styles.dateFormat}>{getDate(this.props.event.to)}</Text>
                  <Text style={styles.dateFormat}>{getTime(this.props.event.to)}</Text>
                </View>
              </View>
              <View style={styles.eventDetailsView}>
                <Text style={styles.eventDetailsHeader}>Location</Text>
                <Text style={styles.eventDetailsBody}>{this.props.event.location || '-'}</Text>
              </View>
              <View style={styles.eventDetailsView}>
                <Text style={styles.eventDetailsHeader}>Notes</Text>
                <Text style={styles.eventDetailsBody}>{this.props.event.notes || '-'}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
              <View style={{ flex: 1, borderRightWidth: 1, height: 200, borderColor: "#D8D8D8" }}>
                <Text style={[styles.attendanceHeader, { color: "#2AC58B" }]}>Attending</Text>
                <FlatList
                  data={this.props.attending}
                  renderItem={this.renderRow}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <View style={{ flex: 1, height: 200 }}>
                <Text style={[styles.attendanceHeader, { color: "#E83838" }]}>Not Attending</Text>
                <FlatList
                  data={this.props.notAttending}
                  renderItem={this.renderRow}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView >
    )
  }
}

const mapStateToProps = state => {
  return {
    modalVisibility: state.eventModalReducer.modalVisibility,
    event: state.eventModalReducer.event || {},
    attending: state.eventModalReducer.attending || [],
    notAttending: state.eventModalReducer.notAttending || [],
  }
}

export default connect(mapStateToProps)(EventModal);

const styles = StyleSheet.create({
  dateFormat: {
    textAlign: "center",
    fontSize: 20,
    color: cliqueBlue,
    fontWeight: "bold"
  },
  attendanceHeader: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10
  },
  eventDetailsHeader: {
    textAlign: "center",
    fontWeight: "bold",
    color: cliqueBlue,
    fontSize: 25
  },
  eventDetailsBody: {
    textAlign: "center",
    fontWeight: "300",
    color: cliqueBlue,
    fontSize: 23
  },
  eventDetailsView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})