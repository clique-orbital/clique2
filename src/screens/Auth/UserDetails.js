import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import ImagePicker from "../../components/ImagePickerComponent";

class UserDetails extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>
          Select your username and profile picture!
        </Text>
        <ImagePicker />
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
    fontSize: 16
  }
});

export default UserDetails;
