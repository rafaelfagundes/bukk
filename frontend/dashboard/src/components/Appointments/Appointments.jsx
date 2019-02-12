import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import FormTitle from "../Common/FormTitle";
import Axios from "axios";
import config from "../../config";
import { Table, Button, Icon, Segment, Header, Menu } from "semantic-ui-react";
import moment from "moment";
import "./Appointments.css";
import _ from "lodash";
import Loading from "../Loading/Loading";
import Calendar from "./Calendar";

const NoAppointments = props => (
  <Segment placeholder>
    <Header icon>
      <Icon name="calendar times outline" />
      {props.text}
    </Header>
  </Segment>
);

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

const TableBody = ({ data, past }) => {
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
            {!past && (
              <>
                <Button
                  icon
                  color="green"
                  compact
                  title="Confirmar agendamento"
                >
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
              </>
            )}
            {past && (
              <Link to={"/dashboard/agendamentos/" + app._id}>
                <Button
                  icon
                  color="blue"
                  compact
                  title="Visualizar agendamento"
                >
                  <Icon name="search" />
                </Button>
              </Link>
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};

export class Appointments extends Component {
  constructor(props) {
    super(props);
    let _company = JSON.parse(localStorage.getItem("company"));
    const { min, max } = this.setMinMaxTime(_company.workingDays);
    this.state = {
      loading: false,
      before: [],
      today: [],
      tomorrow: [],
      next: [],
      minTime: min.toDate(),
      maxTime: max.toDate(),
      events: [],
      activeItem: "calendar"
    };
  }

  setMinMaxTime = workingDays => {
    let _min = undefined;
    let _max = undefined;
    workingDays.forEach((wd, index) => {
      wd.workingHours.forEach((wh, index) => {
        let _itemMin = moment()
          .hour(wh.start.split(":")[0])
          .minute(wh.start.split(":")[1]);

        let _itemMax = moment()
          .hour(wh.end.split(":")[0])
          .minute(wh.end.split(":")[1]);

        if (_min === undefined) {
          _min = _itemMin;
        }
        if (_max === undefined) {
          _max = _itemMax;
        }
        if (_itemMin.isBefore(_min)) {
          _min = _itemMin;
        }
        if (_itemMax.isAfter(_max)) {
          _max = _itemMax;
        }
      });
    });
    return { min: _min, max: _max };
  };

  setEvents = appointments => {
    let _events = [];

    appointments.forEach(app => {
      _events.push({
        title: `${app.costumer.firstName} - ${app.service.desc}`,
        start: new Date(app.start),
        end: new Date(app.end),
        allDay: false,
        appointmentId: app._id
      });
    });

    this.setState({ events: _events });
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
    this.setState({
      loading: true
    });
    this.props.setCurrentPage({
      title: "Agendamentos",
      icon: "calendar alternate outline"
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
        this.setEvents(response.data.appointments);
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <>
        <div>
          <Menu borderless className="pages-menu">
            <Menu.Item
              name="calendar"
              active={activeItem === "calendar"}
              onClick={this.handleItemClick}
              icon="calendar alternate outline"
              content="Calendário"
            />
            <Menu.Item
              name="next"
              active={activeItem === "next"}
              onClick={this.handleItemClick}
              content="Próximos Agendamentos"
              icon="forward"
            />
            <Menu.Menu position="right">
              <Menu.Item
                name="before"
                active={activeItem === "before"}
                onClick={this.handleItemClick}
                content="Agendamentos Anteriores"
                icon="history"
              />
            </Menu.Menu>
          </Menu>
        </div>
        {this.state.loading && <Loading />}
        {this.state.before.length > 0 && this.state.activeItem === "before" && (
          <>
            <div>
              <FormTitle text="Anteriores" first />
            </div>
            <Table celled>
              <TableHeader />
              <TableBody data={this.state.before} past={true} />
            </Table>
          </>
        )}
        {this.state.before.length === 0 &&
          this.state.activeItem === "before" && (
            <NoAppointments text="Não há agendamentos prévios" />
          )}
        {this.state.today.length === 0 &&
          this.state.tomorrow.length === 0 &&
          this.state.next.length === 0 &&
          this.state.activeItem === "next" && (
            <NoAppointments text="Não há agendamentos futuros" />
          )}
        {this.state.today.length > 0 && this.state.activeItem === "next" && (
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
        {this.state.tomorrow.length > 0 && this.state.activeItem === "next" && (
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
        {this.state.next.length > 0 && this.state.activeItem === "next" && (
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
        {this.state.activeItem === "calendar" && (
          <>
            {this.state.events.length > 0 && (
              <Calendar
                minTime={this.state.minTime}
                maxTime={this.state.maxTime}
                events={this.state.events}
                {...this.props}
              />
            )}
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
