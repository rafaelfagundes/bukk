import React from "react";
import { createAppContainer, createDrawerNavigator } from "react-navigation";
import Home from "./components/home/Home";
import Clients from "./components/clients/Clients";
import Services from "./components/services/Services";

const RootStack = createDrawerNavigator({
  Home,
  Clients,
  Services: {
    screen: () => <Services text="Serviços" />,
    navigationOptions: { title: "Serviços" }
  }
});

const Container = createAppContainer(RootStack);

export default Container;
