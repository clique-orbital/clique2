import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  View,
  StatusBar,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform
} from "react-native";
import { connect } from "react-redux";
import {
  toggleEventModal,
  populateAttending,
  populateNotAttending
} from "../../store/actions/eventModal";
import { cliqueBlue, getDate, getDay, getTime } from "../../assets/constants";
import firebase from "react-native-firebase";
import Text from "../../components/Text";
import MyIcon from "../../components/MyIcon";
import { fetchPersonalEvents, fetchAllEvents } from "../../store/actions/calendar";

class EventModal extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.respondToInvitation = this.respondToInvitation.bind(this);
    this.handleEditButtonPress = this.handleEditButtonPress.bind(this);
  }

  hideModal() {
    this.props.dispatch(toggleEventModal(false, null));
  }

  renderRow = ({ item }) => {
    return (
      <View style={{ flex: 1, height: 30, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 18, color: cliqueBlue }}>
          @{item}
        </Text>
      </View>
    );
  };

  respondToInvitation = (eventID, response) => async () => {
    const groupID = this.props.event.groupID;
    const eventSnapshot = await firebase
      .database()
      .ref(`events/${groupID}/${eventID}`)
      .once("value");
    const event = eventSnapshot.val();
    const attending = (event.attending || []).filter(
      uid => uid !== this.props.uid
    );
    const notAttending = (event.notAttending || []).filter(
      uid => uid !== this.props.uid
    );
    const noResponse = (event.noResponse || []).filter(
      uid => uid !== this.props.uid
    );

    let attendingNames = (this.props.attending || []).filter(
      name => name !== this.props.displayName
    );
    let notAttendingNames = (this.props.notAttending || []).filter(
      name => name !== this.props.displayName
    );

    let updatedEvent;
    if (response) {
      updatedEvent = {
        ...event,
        attending: [...attending, this.props.uid],
        notAttending,
        noResponse
      };
      firebase
        .database()
        .ref(`users/${this.props.uid}/attending/${this.props.event.groupID}/${event.eventID}`)
        .set(true)
      firebase
        .database()
        .ref(`users/${this.props.uid}/notAttending/${this.props.event.groupID}/${event.eventID}`)
        .remove()
      this.props.dispatch(fetchPersonalEvents(this.props.uid))
      attendingNames = [...attendingNames, this.props.displayName];
    } else {
      updatedEvent = {
        ...event,
        attending,
        noResponse,
        notAttending: [...notAttending, this.props.uid]
      };
      firebase
        .database()
        .ref(`users/${this.props.uid}/notAttending/${this.props.event.groupID}/${event.eventID}`)
        .set(true)
      firebase
        .database()
        .ref(`users/${this.props.uid}/attending/${this.props.event.groupID}/${event.eventID}`)
        .remove()
      this.props.dispatch(fetchPersonalEvents(this.props.uid))
      notAttendingNames = [...notAttendingNames, this.props.displayName];
    }
    // updates the group events 
    this.props.dispatch(fetchAllEvents(this.props.uid))
    firebase
      .database()
      .ref(`events/${groupID}/${eventID}`)
      .set(updatedEvent);

    // Updates event in message the event is attached to
    const msgID = updatedEvent.msgID;
    firebase
      .database()
      .ref(`messages/${groupID}/${msgID}/event`)
      .set(updatedEvent);

    // Updates Event Modal
    this.props.dispatch(toggleEventModal(true, updatedEvent));
    this.props.dispatch(populateAttending(attendingNames));
    this.props.dispatch(populateNotAttending(notAttendingNames));
  };

  handleEditButtonPress = () => {
    (this.props.navigation || {}).navigate("CreateEvents", {
      groupID: this.props.event.groupID
    });
  };

  renderTitle = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <Text h1 center black medium>
          {(this.props.event || {}).title}
        </Text>
      </View>
    );
  };

  renderNote = (string, event) => {
    return (
      <View style={styles.eventDetailsView}>
        <MyIcon
          name={string}
          size={40}
          color="grey"
          style={{ marginTop: 20 }}
        />
        <Text h3 grey>
          {event || "-"}
        </Text>
      </View>
    );
  };

  renderSameDate = date => { };

  renderDate = date => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text h3 grey center>
          {getDay(date)}
        </Text>
        <Text h3 grey center>
          {getDate(date)}
        </Text>
        <Text h3 grey center>
          {getTime(date)}
        </Text>
      </View>
    );
  };

  renderArrow = () => {
    return (
      <MyIcon name="arrow-forward" size={40} color="grey" type="material" />
    );
  };

  render() {
    if (Platform.OS === "android") {
      if (this.props.modalVisibility) StatusBar.setBackgroundColor("white");
      else StatusBar.setBackgroundColor(cliqueBlue);
    }
    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={this.props.modalVisibility}
          swipeDirection="down"
          swipeThreshold={200}
          onSwipeComplete={this.hideModal}
          style={{ margin: 0 }}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={{
                height: "5%",
                justifyContent: "flex-end",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{ height: 50, width: 50, marginLeft: 8, flex: 1 }}
                onPress={this.hideModal}
              >
                <Image
                  source={require("../../assets/x.png")}
                  style={{
                    marginLeft: 13,
                    marginTop: 10,
                    height: 20,
                    width: 20
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, height: 50, flexDirection: "row-reverse" }}
                onPress={this.handleEditButtonPress}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 10,
                    color: "black",
                    marginRight: 17
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: "50%", justifyContent: "space-between" }}>
              {this.renderTitle()}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginHorizontal: 20
                }}
              >
                {this.renderDate(this.props.event.from)}
                {this.renderArrow()}
                {this.renderDate(this.props.event.to)}
              </View>

              {this.renderNote("md-map", this.props.event.location)}
              {this.renderNote("md-book", this.props.event.notes)}
            </View>
            <View
              style={{ flexDirection: "row", marginTop: 30, height: "30%" }}
            >
              <View
                style={{
                  flex: 1,
                  borderRightWidth: 1,
                  height: 200,
                  borderColor: "#D8D8D8"
                }}
              >
                <Text style={[styles.attendanceHeader, { color: "#2AC58B" }]}>
                  Attending
                </Text>
                <FlatList
                  data={this.props.attending}
                  renderItem={this.renderRow}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <View style={{ flex: 1, height: "auto" }}>
                <Text style={[styles.attendanceHeader, { color: "#E83838" }]}>
                  Not Attending
                </Text>
                <FlatList
                  data={this.props.notAttending}
                  renderItem={this.renderRow}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", height: "10%" }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.respondInvitationButton,
                    { backgroundColor: "#65c681" }
                  ]}
                  onPress={this.respondToInvitation(
                    this.props.event.eventID,
                    true
                  )}
                  disabled={(this.props.attending || []).includes(
                    this.props.uid
                  )}
                >
                  <Text style={{ color: "#fff" }}>
                    {(this.props.event.attending || []).includes(this.props.uid)
                      ? "Accepted!"
                      : "Accept"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.respondInvitationButton,
                    { backgroundColor: "#E83838" }
                  ]}
                  onPress={this.respondToInvitation(
                    this.props.event.eventID,
                    false
                  )}
                  disabled={(this.props.notAttending || []).includes(
                    this.props.uid
                  )}
                >
                  <Text style={{ color: "#fff" }}>
                    {(this.props.event.notAttending || []).includes(
                      this.props.uid
                    )
                      ? "Rejected!"
                      : "Reject"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    modalVisibility: state.eventModalReducer.modalVisibility,
    event: state.eventModalReducer.event || {},
    attending: state.eventModalReducer.attending || [],
    notAttending: state.eventModalReducer.notAttending || [],
    uid: state.authReducer.user.uid,
    displayName: state.authReducer.user.displayName
  };
};

export default connect(mapStateToProps)(EventModal);

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    alignItems: "center"
  },
  respondInvitationButton: {
    height: 40,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  }
});
