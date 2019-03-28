import React, { Component } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

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

import { isAuthenticated } from "../auth";
import Axios from "axios";

import config from "../config";
import Appointments from "./Appointments/Appointments";
import Appointment from "./Appointments/Appointment";
import Clients from "./Clients/Clients";
import Client from "./Clients/Client";
import Services from "./Services/Services";
import Staff from "./Staff/Staff";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const Pages = styled.div`
  position: fixed;
  min-width: calc(100vw - 200px);
  top: 80px;
  bottom: -25px;
  /* padding: 40px; */
  padding: 25px 20px 40px 20px;
  z-index: 98;
  height: calc(100vh - 40px);
  background-color: white;
  margin-left: 214px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: white;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #eee;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #ddd;
  }
`;

const PagesInner = styled.div`
  padding: 0 0 40px 0;
  width: calc(100vw - 250px);
`;

const BukkNotification = styled(ToastContainer)`
  > .Toastify__toast {
    font-family: "Lato", "sans-serif";
    background-color: rgba(247, 247, 247, 0.98) !important;
    color: #444 !important;
    font-weight: 400 !important;
    border-radius: 4px;
  }
`;

/* ============================================================================ */

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
        <BukkNotification
          hideProgressBar={true}
          position="bottom-left"
          newestOnTop={true}
          suppressClassNameWarning
        />
        <Container fluid>
          <Grid>
            <Grid.Row>
              <BrowserRouter>
                <>
                  <SideMenu />
                  <div id="content">
                    <TopMenu className="top-menu" />

                    <Pages>
                      <PagesInner>
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
                            path="/dashboard/cliente/id/:id"
                            component={Client}
                          />
                          <PrivateRoute
                            path="/dashboard/servicos/"
                            component={Services}
                            exact
                          />
                          <PrivateRoute
                            path="/dashboard/servicos/:option"
                            component={Services}
                            exact
                          />
                          <PrivateRoute
                            path="/dashboard/servicos/:option/:id"
                            component={Services}
                          />
                          <PrivateRoute
                            path="/dashboard/funcionarios/"
                            component={Staff}
                            exact
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
                      </PagesInner>
                    </Pages>
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
