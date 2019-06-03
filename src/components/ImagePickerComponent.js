import React from "react";
import {
  View,
  TouchableHighlight,
  Button,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";
import ImagePicker from "react-native-image-picker";

import defaultProfile from "../assets/default_profile.png";

class ImagePickerComponent extends React.Component {
  state = {
    profilePicture: defaultProfile
  };

  pickImageHandler = () => {
    console.log(Dimensions.get("window").width);
    const options = {
      title: "Select Profile Picture",
      customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({
          profilePicture: source
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.touchable}
          onPress={this.pickImageHandler}
        >
          <Image
            style={styles.profilePicture}
            source={this.state.profilePicture}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: Math.round(Dimensions.get("window").width / 4),
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    paddingTop: "10%"
  },
  profilePicture: {
    borderRadius: Math.round(Dimensions.get("window").width / 4),
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ImagePickerComponent;
