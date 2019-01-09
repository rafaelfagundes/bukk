import React from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login/Login";
import { isAuthenticated } from "./auth";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/dashboard/login", state: { from: props.location } }}
        />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/dashboard/login" component={Login} />
      <PrivateRoute path="/dashboard/" component={Dashboard} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
