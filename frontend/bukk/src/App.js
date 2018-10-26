import React, { Component } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Booker from "./components/Booker/Booker";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/dashboard/" component={Dashboard} />
            <Route path="/agendar/" component={Booker} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
