import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import ContinueButton from "../.././../components/ContinueButton";
import { connect } from "react-redux";
import { fetchEvents } from "../../../store/actions/calendar";
import firebase from "react-native-firebase";

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const timestamp = date.getTime();

class MyCalendar extends React.Component {
  state = {
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

  async componentDidMount() {
    const groupID = this.props.navigation.getParam("groupID");
    await this.props.fetchEvents(groupID);
    firebase
      .database()
      .ref(`events/${groupID}`)
      .on("child_added", () => {
        this.props.fetchEvents(groupID);
      });
  }

  renderButton = () => {
    return (
      <TouchableOpacity
        title="Create"
        onPress={() =>
          this.props.navigation.navigate("CreateEvents", {
            groupID: this.props.navigation.getParam("groupID"),
            date: new Date(this.state.selectedDate.dateString)
          })
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

  loadItems = () => {
    const arrEvents = Object.values(this.props.events).sort((a, b) => {
      return new Date(a.from).getTime() - new Date(b.from).getTime();
    });
    const events = {};
    arrEvents.forEach(event => {
      const date = event.from.split("T");
      const day = date[0];
      if (!events[day]) {
        events[day] = [];
      }
      events[day] = [...events[day], { event }];
    });
    this.setState({ events });
  };

  renderItem(item) {
    const fromTime = new Date(item.event.from).toTimeString().slice(0, 5);
    const toTime = new Date(item.event.to).toTimeString().slice(0, 5);
    return (
      <View style={[styles.item, { height: item.height }]}>
        <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: 10 }}>
          {item.event.title}
        </Text>
        <Text>
          {fromTime} - {toTime}
        </Text>
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

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }

  render() {
    return (
      <View style={{ display: "flex", height: "100%" }}>
        <Agenda
          items={this.state.events}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          onDayPress={day => this.dayPress(day)}
          loadItemsForMonth={this.loadItems.bind(this)}
        />
        {this.renderButton()}
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
    paddingTop: 30
  }
});

const mapStateToProps = state => {
  return { events: state.calendar.events };
};

export default connect(
  mapStateToProps,
  { fetchEvents }
)(MyCalendar);
