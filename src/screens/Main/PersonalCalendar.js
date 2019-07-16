import React from "react";
import HeaderTitle from "../../components/HeaderTitle";
import CalendarComponent from "../../components/CalendarComponent";
import { connect } from "react-redux";

class PersonalCalendar extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <HeaderTitle title="Calendar" />,
      headerStyle: {
        borderBottomColor: "transparent"
      }
    }
  };

  state = { key: "1" }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.colors.whiteBlack !== this.props.colors.whiteBlack) {
      console.log("Inside shouldComponentUpdate")
      console.log(this.state.key)
      this.setState({ key: (this.state.key + 1).toString() })
      console.log(this.state.key)
      return true;
    } else if (nextState.key !== this.state.key) {
      return true;
    }

    return false;
  }

  render() {
    return <CalendarComponent agendaKey={this.state.key} hasButton={false} personal={true} />;
  }
}

const mapStateToProps = state => {
  return {
    colors: state.theme.colors
  }
}
export default connect(mapStateToProps)(PersonalCalendar);