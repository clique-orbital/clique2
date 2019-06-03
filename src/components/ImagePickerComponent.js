import React from "react";
import { View, TouchableHighlight, Image, StyleSheet } from "react-native";
import ImagePicker from "react-native-image-picker";

// takes in prop: width
class ImagePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.styles = StyleSheet.create({
      touchable: {
        borderRadius: this.props.width / 4,
        width: this.props.width / 2,
        height: this.props.width / 2
      },
      profilePicture: {
        borderRadius: this.props.width / 4,
        width: this.props.width / 2,
        height: this.props.width / 2,
        justifyContent: "center",
        alignItems: "center"
      },
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    });
  }

  pickImageHandler = () => {
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
        this.props.setImage(source);
      }
    });
  };

  renderImage = () => {
    return (
      <Image
        style={this.styles.profilePicture}
        source={this.state.profilePicture}
      />
    );
  };

  render() {
    return (
      <View style={this.styles.container}>
        <TouchableHighlight
          style={this.styles.touchable}
          onPress={this.pickImageHandler}
        >
          <View>{this.renderImage()}</View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default ImagePickerComponent;
