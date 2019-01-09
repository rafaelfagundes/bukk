import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";
import TopMenu from "./TopMenu/TopMenu";
import SideMenu from "./SideMenu/SideMenu";
import Overview from "./Overview/Overview";
import Reports from "./Reports/Reports";
import Clients from "./Clients/Clients";
import "./Dashboard.css";
import { isAuthenticated } from "../auth";

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

const Dashboard = () => (
  <div className="Dashboard">
    <Container fluid>
      <TopMenu />
      <Grid>
        <Grid.Row>
          <SideMenu />
          <div id="content">
            <BrowserRouter>
              <Switch>
                <PrivateRoute path="/dashboard/" exact component={Overview} />
                <PrivateRoute
                  path="/dashboard/relatorios"
                  component={Reports}
                />
                <PrivateRoute path="/dashboard/clientes" component={Clients} />
              </Switch>
            </BrowserRouter>
          </div>
        </Grid.Row>
      </Grid>
    </Container>
  </div>
);

export default Dashboard;
