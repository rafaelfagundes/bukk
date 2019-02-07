import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import FormTitle from "../Common/FormTitle";
import Axios from "axios";
import config from "../../config";
import { Table, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import "./Appointments.css";
import _ from "lodash";
export class Appointments extends Component {
  state = {
    tab: "next",
    before: [],
    today: [],
    tomorrow: [],
    next: []
  };

  sortAppointments = appointments => {
    const _before = [];
    const _today = [];
    const _tomorrow = [];
    const _next = [];
    const _todayDate = moment();
    const _tomorrowDate = moment().add(1, "day");

    appointments.forEach(app => {
      const _date = moment(app.start);

      if (
        _date.isSame(_todayDate, "day") &&
        _date.isSameOrAfter(_todayDate, "hour")
      ) {
        _today.push(app);
      } else if (_date.isBefore(_todayDate, "day")) {
        _before.push(app);
      } else if (_date.isSame(_tomorrowDate, "day")) {
        _tomorrow.push(app);
      } else {
        _next.push(app);
      }
    });

    // Sorts previous appointments descending
    _.reverse(_before);

    this.setState({
      before: _before,
      today: _today,
      tomorrow: _tomorrow,
      next: _next
    });
  };

  componentDidMount() {
    this.props.setCurrentPage({
      title: "Agendamentos",
      icon: "calendar outline"
    });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(config.api + "/appointments/list", {}, requestConfig)
      .then(response => {
        this.sortAppointments(response.data.appointments);
      })
      .catch();
  }

  handleTab = tab => {
    this.setState({ tab: tab });
  };

  render() {
    return (
      <>
        <div className="appointments-menu">
          <Button.Group style={{ marginBottom: "40px" }} basic>
            <Button
              icon
              labelPosition="left"
              active={this.state.tab === "calendar"}
              onClick={e => {
                this.handleTab("calendar");
              }}
            >
              <Icon name="calendar alternate outline" />
              Calendário Mensal
            </Button>
            <Button
              icon
              labelPosition="right"
              active={this.state.tab === "weekCalendar"}
              onClick={e => {
                this.handleTab("weekCalendar");
              }}
            >
              <Icon name="calendar outline" />
              Calendário Semanal
            </Button>
          </Button.Group>{" "}
          <Button.Group style={{ marginBottom: "40px" }} basic>
            <Button
              icon
              labelPosition="left"
              active={this.state.tab === "next"}
              onClick={e => {
                this.handleTab("next");
              }}
            >
              <Icon name="clock outline" />
              Próximos agendamentos
            </Button>
            <Button
              icon
              labelPosition="right"
              active={this.state.tab === "before"}
              onClick={e => {
                this.handleTab("before");
              }}
            >
              <Icon name="history" />
              Agendamentos anteriores
            </Button>
          </Button.Group>
        </div>
        {this.state.before.length > 0 && this.state.tab === "before" && (
          <>
            <div>
              <FormTitle text="Anteriores" first />
            </div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Serviço</Table.HeaderCell>
                  <Table.HeaderCell>Especialista</Table.HeaderCell>
                  <Table.HeaderCell>Cliente</Table.HeaderCell>
                  <Table.HeaderCell>Data</Table.HeaderCell>
                  <Table.HeaderCell>Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.before.map((app, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{app.service.desc}</Table.Cell>
                    <Table.Cell>
                      {app.user.firstName + " " + app.user.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {app.costumer.firstName + " " + app.costumer.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {moment(app.start).format("DD/MM/YYYY[ de ]HH:mm") +
                        " às " +
                        moment(app.end).format("HH:mm")}
                    </Table.Cell>
                    <Table.Cell width="1">
                      <Button icon color="blue">
                        <Icon name="search" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {this.state.today.length > 0 && this.state.tab === "next" && (
          <>
            <div>
              <FormTitle text="Hoje" first />
            </div>
            <Table celled compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Serviço</Table.HeaderCell>
                  <Table.HeaderCell>Especialista</Table.HeaderCell>
                  <Table.HeaderCell>Cliente</Table.HeaderCell>
                  <Table.HeaderCell>Horário</Table.HeaderCell>
                  <Table.HeaderCell>Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.today.map((app, index) => (
                  <Table.Row key={index}>
                    <Table.Cell width={1} textAlign="center">
                      {app.status === "created" && (
                        <Icon name="hourglass half" />
                      )}
                    </Table.Cell>
                    <Table.Cell width={6}>{app.service.desc}</Table.Cell>
                    <Table.Cell collapsing>
                      {app.user.firstName + " " + app.user.lastName}
                    </Table.Cell>
                    <Table.Cell collapsing>
                      {app.costumer.firstName + " " + app.costumer.lastName}
                    </Table.Cell>
                    <Table.Cell collapsing>
                      {moment(app.start).format("HH:mm") +
                        " às " +
                        moment(app.end).format("HH:mm")}
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <Button icon color="green" compact>
                        <Icon name="check" />
                      </Button>
                      <Button icon color="blue" compact>
                        <Icon name="edit outline" />
                      </Button>
                      <Button icon color="red" compact>
                        <Icon name="delete" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {this.state.tomorrow.length > 0 && this.state.tab === "next" && (
          <>
            <div>
              <FormTitle text="Amanhã" first={this.state.today.length === 0} />
            </div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Serviço</Table.HeaderCell>
                  <Table.HeaderCell>Especialista</Table.HeaderCell>
                  <Table.HeaderCell>Cliente</Table.HeaderCell>
                  <Table.HeaderCell>Data</Table.HeaderCell>
                  <Table.HeaderCell>Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.tomorrow.map((app, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{app.service.desc}</Table.Cell>
                    <Table.Cell>
                      {app.user.firstName + " " + app.user.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {app.costumer.firstName + " " + app.costumer.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {"De " +
                        moment(app.start).format("HH:mm") +
                        " às " +
                        moment(app.end).format("HH:mm")}
                    </Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {this.state.next.length > 0 && this.state.tab === "next" && (
          <>
            <div>
              <FormTitle
                text="Próximos dias"
                first={
                  this.state.tomorrow.length === 0 &&
                  this.state.today.length === 0
                }
              />
            </div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Serviço</Table.HeaderCell>
                  <Table.HeaderCell>Especialista</Table.HeaderCell>
                  <Table.HeaderCell>Cliente</Table.HeaderCell>
                  <Table.HeaderCell>Data</Table.HeaderCell>
                  <Table.HeaderCell>Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.next.map((app, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{app.service.desc}</Table.Cell>
                    <Table.Cell>
                      {app.user.firstName + " " + app.user.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {app.costumer.firstName + " " + app.costumer.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {moment(app.start).format("DD/MM/YYYY[ de ]HH:mm") +
                        " às " +
                        moment(app.end).format("HH:mm")}
                    </Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {/* <pre>{JSON.stringify(this.state.today, null, 2)}</pre> */}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.dashboard.user,
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointments);
