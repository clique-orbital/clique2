import React from "react";
import CalendarComponent from "../../../components/CalendarComponent";
import { connect } from "react-redux";
import { resetEventState } from "../../../store/actions/createEvents";

class CalendarScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: "#fff",
      headerTitle: navigation.getParam("title") || (this.props || {}).title,
      headerStyle: {
        borderBottomColor: "transparent"
      },
    };
  };

  componentWillMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.dispatch(resetEventState());
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  render() {
    return (
      <CalendarComponent
        groupID={this.props.navigation.getParam("groupID")}
        hasButton={true}
        personal={false}
        nav={dateString =>
          this.props.navigation.navigate("CreateEvents", {
            groupID: this.props.navigation.getParam("groupID"),
            date: dateString,
          })
        }
      />
    );
  }
}

export default connect()(CalendarScreen);
