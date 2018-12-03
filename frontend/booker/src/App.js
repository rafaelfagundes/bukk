import React, { Component } from "react";
import "./App.css";
import Booker from "./components/Booker";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/agendar/" component={Booker} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
