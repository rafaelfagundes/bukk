import React, { Component } from "react";
import Booker from "./components/Booker";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/agendar/:companyId" component={Booker} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
