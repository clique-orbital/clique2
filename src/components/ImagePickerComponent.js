import React from "react";
import { View, TouchableHighlight, StyleSheet } from "react-native";
import ImagePicker from "react-native-image-picker";

import ProfilePicture from "../components/ProfilePicture";
// takes in prop: width, image
class ImagePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.styles = StyleSheet.create({
      touchable: {
        borderRadius: this.props.width / 4,
        width: this.props.width / 2,
        height: this.props.width / 2
      },
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    });
    this.state = { profilePicture: this.props.value };
  }

  pickImageHandler = () => {
    const options = {
      title: "Select Profile Picture",
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
        this.setState({ profilePicture: response });
        // for redux-form to know that there is an input/value change
        this.props.onChange(response);
      }
    });
  };

  render() {
    return (
      <View style={this.styles.container}>
        <TouchableHighlight
          style={this.styles.touchable}
          onPress={this.pickImageHandler}
        >
          <ProfilePicture
            profilePicture={this.state.profilePicture}
            width={this.props.width}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

export default ImagePickerComponent;
