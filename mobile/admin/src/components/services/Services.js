import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { TextInput } from "react-native-gesture-handler";

export default class Services extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  state = {
    text: ""
  };

  changeText = text => {
    this.setState({ text });
  };

  render() {
    return (
      <View>
        <Text>{this.props.text}</Text>
        <TextInput
          value={this.state.text}
          onChangeText={this.changeText}
          style={styles.inputText}
        />
        <Text>{this.state.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputText: {
    borderWidth: 1,
    fontSize: 20,
    marginTop: 10
  }
});
