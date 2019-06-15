import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import ContinueButton from "../.././../components/ContinueButton";

class MyCalendar extends React.Component {
  renderButton = () => {
    return (
      <TouchableOpacity
        title="Create"
        onPress={() =>
          this.props.navigation.navigate("CreateEvents", {
            groupID: this.props.navigation.getParam("groupID")
          })
        }
        style={{ position: "absolute", top: "90%", left: "80%" }}
      >
        <ContinueButton name="add" />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ display: "flex", height: "100%" }}>
        <Agenda />
        {this.renderButton()}
      </View>
    );
  }
}

export default MyCalendar;
