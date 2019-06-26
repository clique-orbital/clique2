import React from "react";
import { createStackNavigator } from "react-navigation";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import CalendarComponent from "../../components/CalendarComponent";
import { connect } from "react-redux";
import { fetchPersonalEvents } from "../../store/actions/calendar";
import firebase from "react-native-firebase";

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

// const calendarStack = createStackNavigator({ Main: PersonalCalendar });

// export default calendarStack;

const mapStateToProps = state => {
  return {
    uid: state.authReducer.user.uid
  }
}

export default connect(
  mapStateToProps,
  { fetchPersonalEvents }
)(PersonalCalendar);

// export default PersonalCalendar;