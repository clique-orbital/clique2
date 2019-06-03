import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { SafeAreaView } from "react-navigation";
import ImagePicker from "../../components/ImagePickerComponent";
import { connect } from "react-redux";

import MyIcon from "../../components/MyIcon";
import { setUsernameAndProfile } from "../../store/actions/auth";

class UserDetails extends React.Component {
  setImage = image => {
    this.setState({ profilePicture: image });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>
          Enter your username and profile picture!
        </Text>
        <ImagePicker
          width={Dimensions.get("window").width}
          profilePicture={this.props.profilePicture}
          setImage={this.setImage}
        />
        <TextInput style={styles.textInput} placeholder="Enter username" />
        <TouchableHighlight title="Continue" style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "blue", marginRight: 7 }}>Continue</Text>
            <View style={{ marginTop: 1 }}>
              <MyIcon name="ios-arrow-forward" size={13} color="blue" />
            </View>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "25%"
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  textInput: {
    marginTop: "10%",
    width: "70%",
    height: 15,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  button: {
    marginTop: 20
  }
});

const mapStateToProps = state => {
  const { username, profilePicture } = state;
  console.log(state);
  return { username, profilePicture };
};

export default connect(
  mapStateToProps,
  { setUsernameAndProfile }
)(UserDetails);
