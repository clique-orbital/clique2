import React, { Component } from "react";
import { StyleSheet, View, TextInput, Dimensions } from "react-native";

class CreateEvents extends Component {

  static navigationOptions = ({ navigation }) => {
      return {
        title: "Create Event",
        headerTintColor: "#fff",
      }
  };


  render(){
    const { height, width } = Dimensions.get('window');

      return(
          <View style={styles.container}>
            <View style={{paddingVertical: 150}}>
              <TextInput
                  placeholder="Title"
                  style={{...(styles.textInput), width: width}}
                />
                <TextInput
                  placeholder="Location"
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Notes"
                  style={styles.textInput}
                />
            </View>
          </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 20
  }
})

export default CreateEvents;

