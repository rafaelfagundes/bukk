import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import FormTitle from "../Common/FormTitle";
import Axios from "axios";
import config from "../../config";
import { Table, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import "./Appointments.css";
import _ from "lodash";
import Loading from "../Loading/Loading";

const TableHeader = () => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Serviço</Table.HeaderCell>
      <Table.HeaderCell>Especialista</Table.HeaderCell>
      <Table.HeaderCell>Cliente</Table.HeaderCell>
      <Table.HeaderCell>Data/Horário</Table.HeaderCell>
      <Table.HeaderCell>Ações</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

const TableBody = ({ data }) => {
  let _fullDate = true;
  if (
    moment().isSameOrAfter(moment(data[0].start), "day") &&
    moment().isSameOrBefore(moment(data[0].start), "hour")
  ) {
    _fullDate = false;
  }
  if (
    moment()
      .add(1, "day")
      .isSameOrAfter(moment(data[0].start), "day") &&
    moment()
      .add(1, "day")
      .isSameOrBefore(moment(data[0].start), "hour")
  ) {
    _fullDate = false;
  }

  return (
    <Table.Body>
      {data.map((app, index) => (
        <Table.Row key={index}>
          <Table.Cell width={1} textAlign="center">
            {app.status === "created" && (
              <Icon name="hourglass half" title="Aguardando confirmação" />
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
            {_fullDate && (
              <>
                {moment(app.start).format("dddd, DD/MM/YY[ - ]HH:mm") +
                  " às " +
                  moment(app.end).format("HH:mm")}
              </>
            )}
            {!_fullDate && (
              <>
                {moment(app.start).format("HH:mm") +
                  " às " +
                  moment(app.end).format("HH:mm")}
              </>
            )}
          </Table.Cell>
          <Table.Cell collapsing>
            <Button icon color="green" compact title="Confirmar agendamento">
              <Icon name="check" />
            </Button>
            <Link to={"/dashboard/agendamentos/" + app._id}>
              <Button
                icon
                color="blue"
                compact
                title="Ver ou editar agendamento"
              >
                <Icon name="edit outline" />
              </Button>
            </Link>
            <Button icon color="red" compact title="Cancelar agendamento">
              <Icon name="delete" />
            </Button>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};

export class Appointments extends Component {
  state = {
    loading: false,
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
      if (_date.isBefore(_todayDate, "hour")) {
        _before.push(app);
      } else if (_date.isSame(_todayDate, "day")) {
        _today.push(app);
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
    this.setState({ loading: true });
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
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
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
        {this.state.loading && <Loading />}
        {this.state.before.length > 0 && this.state.tab === "before" && (
          <>
            <div>
              <FormTitle text="Anteriores" first />
            </div>
            <Table celled>
              <TableHeader />
              <TableBody data={this.state.before} />
            </Table>
          </>
        )}
        {this.state.today.length > 0 && this.state.tab === "next" && (
          <>
            <div>
              <FormTitle
                text={"Hoje - " + moment().format("DD/MM/YYYY")}
                first
              />
            </div>
            <Table celled compact>
              <TableHeader />
              <TableBody data={this.state.today} />
            </Table>
          </>
        )}
        {this.state.tomorrow.length > 0 && this.state.tab === "next" && (
          <>
            <div>
              <FormTitle
                text={
                  "Amanhã - " +
                  moment()
                    .add(1, "day")
                    .format("DD/MM/YYYY")
                }
                first={this.state.today.length === 0}
              />
            </div>
            <Table celled>
              <TableHeader />
              <TableBody data={this.state.tomorrow} />
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
              <TableHeader />
              <TableBody data={this.state.next} />
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
