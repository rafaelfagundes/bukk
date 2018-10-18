import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";
import TopMenu from "../TopMenu/TopMenu";
import SideMenu from "../SideMenu/SideMenu";
import Overview from "../Overview/Overview";
import Reports from "../Reports/Reports";
import "./Dashboard.css";

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
                <Route path="/" exact component={Overview} />
                <Route path="/relatorios" component={Reports} />
              </Switch>
            </BrowserRouter>
          </div>
        </Grid.Row>
      </Grid>
    </Container>
  </div>
);

export default Dashboard;
