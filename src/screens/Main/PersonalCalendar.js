import React from "react";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import CalendarComponent from "../../components/CalendarComponent";
import { connect } from "react-redux"

class PersonalCalendar extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <HeaderTitle title="Calendar" />,
      headerStyle: {
        backgroundColor: cliqueBlue
      },
      headerStyle: {
        backgroundColor: (navigation.state.params || {}).backgroundColor || cliqueBlue,
        borderBottomColor: "transparent"
      }
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      backgroundColor: this.props.colors.headerColor,
    })
  }

  render() {
    return <CalendarComponent hasButton={false} personal={true} />;
  }
}

const mapStateToProps = state => {
  return {
    colors: state.theme.colors
  }
}
export default connect(mapStateToProps)(PersonalCalendar);