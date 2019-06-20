import React from "react";
import CalendarComponent from "../../../components/CalendarComponent";

class CalendarScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: navigation.getParam("title") || (this.props || {}).title
    };
  };

  render() {
    return (
      <CalendarComponent groupID={this.props.navigation.getParam("groupID")} />
    );
  }
}

export default CalendarScreen;
