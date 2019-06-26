import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import ContinueButton from "./ContinueButton";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import {
  toggleEventModal,
  populateAttending,
  populateNotAttending
} from "../store/actions/eventModal";
import EventModal from "../screens/Main/EventModal";
import _ from "lodash";

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const timestamp = date.getTime();

class CalendarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: {
        day,
        month,
        year,
        timestamp,
        dateString: `${year}-${(month + "").padStart(2, "0")}-${(
          day + ""
        ).padStart(2, "0")}`
      },
      events: {}
    };
    this.showEventModal = this.showEventModal.bind(this);
    this.loadItems = this.loadItems.bind(this);
  }

  renderButton = () => {
    if (!this.props.hasButton) {
      return <View />;
    }
    return (
      <TouchableOpacity
        title="Create"
        onPress={() =>
          this.props.nav(new Date(this.state.selectedDate.dateString))
        }
        style={{ position: "absolute", top: "90%", left: "80%" }}
      >
        <ContinueButton name="add" />
      </TouchableOpacity>
    );
  };

  dayPress = day => {
    this.setState({ selectedDate: day });
  };

  showEventModal = event => async () => {
    let attending = event.attending || [];
    let notAttending = event.notAttending || [];
    attending = await attending.map(async uid => {
      const nameSnapshot = await firebase
        .database()
        .ref(`users/${uid}/displayName`)
        .once("value");
      return nameSnapshot.val();
    });

    Promise.all(attending).then(members => {
      this.props.dispatch(populateAttending(members));
    });

    notAttending = await notAttending.map(async uid => {
      const nameSnapshot = await firebase
        .database()
        .ref(`users/${uid}/displayName`)
        .once("value");
      return nameSnapshot.val();
    });

    Promise.all(notAttending).then(members => {
      this.props.dispatch(populateNotAttending(members));
    });

    this.props.dispatch(toggleEventModal(true, event));
  };

  renderItem(item) {
    const fromTime = new Date(item.event.from).toTimeString().slice(0, 5);
    const toTime = new Date(item.event.to).toTimeString().slice(0, 5);
    return (
      <View style={[styles.item, { height: item.height }]}>
        <TouchableOpacity onPress={this.showEventModal(item.event)}>
          <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: 10 }}>
            {item.event.title}
          </Text>
          <Text>
            {fromTime} - {toTime}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  renderEmptyData() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 40
        }}
      >
        <Text style={{ fontSize: 20 }}>No events on this day!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return !(_.isEqual(r1, r2));
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }

  loadItems = () => {
    // const arrEvents = _.values(this.props.events).sort((a, b) => {
    //   return new Date(a.from).getTime() - new Date(b.from).getTime();
    // });
    // const events = {};
    // arrEvents.forEach(event => {
    //   const date = event.from.split("T");
    //   const day = date[0];
    //   if (!events[day]) {
    //     events[day] = [];
    //   }
    //   events[day] = [...events[day], { event }];
    // });
    // this.setState({ events });
    return this.props.events;
  };

  render() {
    return (
      <View>
        <View style={{ display: "flex", height: "100%" }}>
          <Agenda
            items={this.props.events}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            rowHasChanged={this.rowHasChanged.bind(this)}
            onDayPress={day => this.dayPress(day)}
            loadItemsForMonth={this.props.loadItems}
            renderEmptyData={this.renderEmptyData.bind(this)}
          />
          {this.renderButton()}
        </View>
        <EventModal />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    backgroundColor: "red"
  }
});

const mapStateToProps = (state, ownProps) => {
  let sortedEventsArr = [];

  if (ownProps.personal) { //personal calendar
    sortedEventsArr = state.calendar.personalEvents.sort((a, b) => {
      return new Date(a.from).getTime() - new Date(b.from).getTime();
    });
  } else { // group calendar
    sortedEventsArr = _.values(state.calendar.events[ownProps.groupID]).sort((a, b) => {
      return new Date(a.from).getTime() - new Date(b.from).getTime();
    });
  }

  const events = {};
  sortedEventsArr.forEach(event => {
    const date = event.from.split("T");
    const day = date[0];
    if (!events[day]) {
      events[day] = [];
    }
    events[day] = [...events[day], { event }];
  });

  return {
    events,
    loadItems: () => this.events,
    modalVisibility: state.eventModalReducer.modalVisibility
  }

  // let events = {};
  // if (!ownProps.groupID) {
  //   const allEvents = state.calendar.events;
  //   for (gid in allEvents) {
  //     for (event in allEvents[gid]) {
  //       events[event] = allEvents[gid][event];
  //     }
  //   }
  //   return { events };
  // }
  // const groupId = ownProps.groupID;
  // events = state.calendar.events[groupId];
  // if (!events) {
  //   return { events: {} };
  // }
  // return { events };
};

export default connect(
  mapStateToProps
)(CalendarComponent);
