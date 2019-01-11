import React, { Component } from "react";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { setUser, setEmployee } from "./dashboardActions";

import TopMenu from "./TopMenu/TopMenu";
import SideMenu from "./SideMenu/SideMenu";
import Overview from "./Overview/Overview";
import Reports from "./Reports/Reports";
import Profile from "./Profile/Profile";

import "./Dashboard.css";
import { isAuthenticated } from "../auth";
import Axios from "axios";

import config from "../config";

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

const mapStateToProps = state => {
  return {
    user: state.dashboard.user,
    employee: state.dashboard.employee
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user)),
    setEmployee: employee => dispatch(setEmployee(employee))
  };
};

class Dashboard extends Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    if (localStorage.user !== undefined) {
      const user = JSON.parse(localStorage.user);
      this.props.setUser(user);
    } else {
      Axios.post(config.api + "/users", null, requestConfig)
        .then(response => {
          this.props.setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          if (response.data.role === "employee") {
            Axios.post(config.api + "/specialists/user", null, requestConfig)
              .then(response => {
                this.props.setEmployee(response.data);
                localStorage.setItem("employee", JSON.stringify(response.data));
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (localStorage.employee !== undefined) {
      const employee = JSON.parse(localStorage.employee);
      this.props.setEmployee(employee);
    }
  }

  render() {
    return (
      <div className="Dashboard">
        <Container fluid>
          <Grid>
            <Grid.Row>
              <SideMenu />

              <div id="content">
                <TopMenu className="top-menu" />

                <div id="pages">
                  <BrowserRouter>
                    <Switch>
                      <PrivateRoute
                        path="/dashboard/"
                        exact
                        component={Overview}
                      />
                      <PrivateRoute
                        path="/dashboard/relatorios"
                        component={Reports}
                      />
                      <PrivateRoute
                        path="/dashboard/perfil"
                        component={Profile}
                      />
                    </Switch>
                  </BrowserRouter>
                </div>
              </div>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
