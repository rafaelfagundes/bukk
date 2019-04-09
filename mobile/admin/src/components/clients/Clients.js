import React, { Component } from "react";
import { Text, View, Alert, ToastAndroid, Platform } from "react-native";

export default class Clients extends Component {
  componentDidMount() {
    this.notification("Componente montado");
  }

  notification = msg => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.LONG);
    } else {
      Alert.alert("Informação", msg);
    }
  };

  render() {
    return (
      <View>
        <Text> Clients </Text>
      </View>
    );
  }
}
