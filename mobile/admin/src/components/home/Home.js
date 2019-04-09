import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class Home extends Component {
  static navigationOptions = {
    title: "Bukk",
    headerStyle: {
      backgroundColor: "#440044"
    },
    headerTintColor: "#FFF"
  };

  componentDidMount() {
    console.log("=> Montou Home");
  }

  render() {
    return (
      <View>
        <Text style={styles.header}>Olá, Rafael!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    fontSize: 60,
    fontWeight: "100"
  }
});
