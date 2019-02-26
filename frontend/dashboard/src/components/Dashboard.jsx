import React, { Component } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { setUser, setEmployee, setCompany } from "./dashboardActions";

import TopMenu from "./TopMenu/TopMenu";
import SideMenu from "./SideMenu/SideMenu";
import Overview from "./Overview/Overview";
import Reports from "./Reports/Reports";
import Profile from "./Profile/Profile";
import CompanyConfig from "./CompanyConfig/CompanyConfig";

import "./Dashboard.css";
import { isAuthenticated } from "../auth";
import Axios from "axios";

import config from "../config";
import Appointments from "./Appointments/Appointments";
import Appointment from "./Appointments/Appointment";
import Clients from "./Clients/Clients";
import { Client } from "./Clients/Client";

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
    setEmployee: employee => dispatch(setEmployee(employee)),
    setCompany: company => dispatch(setCompany(company))
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

    if (localStorage.company !== undefined) {
      const company = JSON.parse(localStorage.company);
      this.props.setCompany(company);
    } else {
      Axios.post(config.api + "/companies", null, requestConfig)
        .then(response => {
          this.props.setCompany(response.data.company);
          localStorage.setItem(
            "company",
            JSON.stringify(response.data.company)
          );
        })
        .catch();
    }
  }

  render() {
    return (
      <div className="Dashboard">
        <ToastContainer
          className="bukk-notification"
          hideProgressBar={true}
          position="bottom-left"
          newestOnTop={true}
        />
        <Container fluid>
          <Grid>
            <Grid.Row>
              <BrowserRouter>
                <>
                  <SideMenu />

                  <div id="content">
                    <TopMenu className="top-menu" />

                    <div id="pages">
                      <div className="pages-inner">
                        <Switch>
                          <PrivateRoute
                            path="/dashboard"
                            exact
                            component={Overview}
                          />
                          <PrivateRoute
                            path="/dashboard/relatorios"
                            component={Reports}
                          />
                          <PrivateRoute
                            path="/dashboard/agendamentos"
                            exact
                            component={Appointments}
                          />
                          <PrivateRoute
                            path="/dashboard/agendamentos/:option"
                            exact
                            component={Appointments}
                          />
                          <PrivateRoute
                            path="/dashboard/agendamento/id/:id"
                            component={Appointment}
                          />
                          <PrivateRoute
                            path="/dashboard/clientes/"
                            component={Clients}
                            exact
                          />
                          <PrivateRoute
                            path="/dashboard/clientes/:option"
                            component={Clients}
                          />
                          <PrivateRoute
                            path="/dashboard/client/id/:id"
                            component={Client}
                          />
                          <PrivateRoute
                            path="/dashboard/perfil"
                            component={Profile}
                          />
                          <PrivateRoute
                            path="/dashboard/configuracoes-empresa"
                            component={CompanyConfig}
                          />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </>
              </BrowserRouter>
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
