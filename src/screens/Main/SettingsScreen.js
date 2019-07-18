import React from "react";
import { View, StyleSheet, Switch, StatusBar } from "react-native";
import HeaderTitle from "../../components/HeaderTitle";
import { cliqueBlue } from "../../assets/constants";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { SIGN_OUT } from "../../store/constants";
import { toggleTheme } from "../../store/actions/theme";
import Spinner from "../../components/Spinner";
import Text from "../../components/Text";
import Button from "../../components/Button";
import GroupPicture from "../../components/GroupPicture";
import MyIcon from "../../components/MyIcon";

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <HeaderTitle title="Settings" />,
      headerStyle: {
        backgroundColor: cliqueBlue
      },
      headerStyle: {
        backgroundColor:
          (navigation.state.params || {}).backgroundColor || cliqueBlue
      }
    };
  };

  state = {
    loading: false,
    darkMode: this.props.darkMode
  };

  componentDidMount() {
    this.props.navigation.setParams({
      backgroundColor: this.props.colors.main
    });
  }

  signOut = () => {
    this.setState({ loading: true });
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.dispatch({ type: SIGN_OUT });
      })
      .then(() => this.props.navigation.navigate("Auth"));
  };

  renderProfilePic() {
    return (
      <GroupPicture
        cached={true}
        source={{ uri: this.props.uri }}
        value={0.4}
      />
    );
  }

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode }, async () => {
      this.props.dispatch(toggleTheme(this.state.darkMode));
    });
  };

  render() {
    if (this.props.modalVisibility) StatusBar.setBackgroundColor("white");
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.props.colors.whiteBlack }
        ]}
      >
        {this.renderProfilePic()}
        <Text
          center
          h3
          light
          style={{ marginTop: 50, color: this.props.colors.textColor }}
        >
          @{this.props.username}
        </Text>
        <Text center h3 light color={this.props.colors.textColor}>
          {this.props.phoneNumber}
        </Text>
        <Button
          shadow
          onPress={this.signOut}
          color={this.props.colors.lightMain}
          style={{ top: 10, width: "50%" }}
        >
          <Text center semibold color={this.props.colors.textColor}>
            Sign Out
          </Text>
        </Button>
        <View
          style={{
            marginTop: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 10
            }}
          >
            <MyIcon
              type="material-community"
              size={30}
              color="lightgrey"
              name="white-balance-sunny"
            />
          </View>
          <Switch
            trackColor={{ true: "lightgrey" }}
            thumbColor={this.props.colors.textColor}
            onValueChange={this.toggleDarkMode.bind(this)}
            value={this.state.darkMode}
          />
          <View style={{ margin: 10 }}>
            <MyIcon
              type="material-community"
              size={30}
              color="lightgrey"
              name="brightness-2"
            />
          </View>
        </View>
        {this.state.loading && <Spinner />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    phoneNumber: state.authReducer.user.phoneNumber,
    username: state.authReducer.user.displayName,
    uri: state.authReducer.user.photoURL,
    darkMode: state.theme.mode,
    colors: state.theme.colors
  };
};

export default connect(
  mapStateToProps,
  null
)(SettingsScreen);
