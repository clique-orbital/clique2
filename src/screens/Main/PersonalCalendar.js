import React from "react";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import CalendarComponent from "../../components/CalendarComponent";

class PersonalCalendar extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Calendar" />,
    headerStyle: {
      backgroundColor: cliqueBlue
    }
  };

  render() {
    return <CalendarComponent hasButton={false} personal={true} />;
  }
}

export default PersonalCalendar;