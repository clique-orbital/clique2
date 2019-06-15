import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import ContinueButton from "../.././../components/ContinueButton";
import { connect } from "react-redux";

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

  loadItems(day) {
    // setTimeout(() => {
    //   for (let i = -15; i < 85; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = this.timeToString(time);
    //     if (!this.state.events[strTime]) {
    //       this.state.events[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 5);
    //       for (let j = 0; j < numItems; j++) {
    //         this.state.events[strTime].push({
    //           name: "Item for " + strTime,
    //           height: Math.max(50, Math.floor(Math.random() * 150))
    //         });
    //       }
    //     }
    //   }
    //   //console.log(this.state.events);
    //   const newItems = {};
    //   Object.keys(this.state.events).forEach(key => {
    //     newItems[key] = this.state.events[key];
    //   });
    //   this.setState({
    //     items: newItems
    //   });
    // }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, { height: item.height }]}>
        <Text>{item.name}</Text>
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
          loadItemsForMonth={this.loadItems.bind(this)}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          onDayPress={day => this.dayPress(day)}
          // markingType={'period'}
          // markedDates={{
          //    '2017-05-08': {textColor: '#666'},
          //    '2017-05-09': {textColor: '#666'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
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
  return;
};

export default connect(
  null,
  {}
)(MyCalendar);
