import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "./Text";

class EventBubble extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <TouchableOpacity
          style={styles.eventBubbleContent}
          onPress={this.props.showEventModal(this.props.item.event)}
        >
          <View>
            <Text medium h2 style={{ ...styles.eventDetails }}>
              {this.props.item.event.title}
            </Text>
            <Text light body style={styles.eventDetails}>
              {this.props.convertDate(this.props.item.event.from) +
                " to\n" +
                this.props.convertDate(this.props.item.event.to)}
            </Text>
            <Text
              light
              body
              style={{
                ...styles.eventDetails,
                display: this.props.item.event.location ? "flex" : "none"
              }}
            >
              Location: {this.props.item.event.location}
            </Text>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <Text
              style={{
                color: "white",
                paddingRight: 13,
                paddingBottom: 7,
                fontSize: 10
              }}
            >
              {this.props.convertTime(this.props.item.timestamp)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.eventBubbleButtons}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={this.props.respondToInvitation(this.props.eventID, true)}
              disabled={(this.props.item.event.attending || []).includes(
                this.props.uid
              )}
            >
              <Text style={styles.invitationButton}>
                {(this.props.item.event.attending || []).includes(
                  this.props.uid
                )
                  ? "Accepted!"
                  : "Accept"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={this.props.respondToInvitation(
                this.props.eventID,
                false
              )}
              disabled={(this.props.item.event.notAttending || []).includes(
                this.props.uid
              )}
            >
              <Text white style={styles.invitationButton}>
                {(this.props.item.event.notAttending || []).includes(
                  this.props.uid
                )
                  ? "Rejected!"
                  : "Reject"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  invitationButton: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  },
  eventDetails: {
    color: "black",
    padding: 7,
    flex: 1
  },
  eventBubbleContent: {
    flexWrap: "nowrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5
  },
  eventBubbleButtons: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  acceptButton: {
    backgroundColor: "#65c681",
    height: 40,
    justifyContent: "center",
    borderBottomLeftRadius: 20
  },
  rejectButton: {
    backgroundColor: "#c13f3f",
    height: 40,
    justifyContent: "center",
    borderBottomRightRadius: 20
  }
});

export default EventBubble;
