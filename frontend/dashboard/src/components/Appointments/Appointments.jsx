import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { setCurrentPage } from "../dashboardActions";
import FormTitle from "../Common/FormTitle";
import Axios from "axios";
import config from "../../config";
import {
  Table,
  Button,
  Icon,
  Segment,
  Header,
  Menu,
  Confirm
} from "semantic-ui-react";
import moment from "moment";
import "./Appointments.css";
import _ from "lodash";
import Loading from "../Loading/Loading";
import Calendar from "./Calendar";
import Notification from "../Notification/Notification";
import NewAppointment from "./NewAppointment";

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

const TableBody = ({
  data,
  past,
  confirmAppointment,
  cancelAppointment,
  setConfirmationModal
}) => {
  let _fullDate = true;
  if (moment().isSame(moment(data[0].start), "day")) {
    _fullDate = false;
  }
  if (
    moment()
      .add(1, "day")
      .isSame(moment(data[0].start), "day")
  ) {
    _fullDate = false;
  }

  return (
    <Table.Body>
      {data.map((app, index) => (
        <Table.Row key={index} className={"appointments-row-" + app.status}>
          <Table.Cell width={1} textAlign="center">
            {app.status === "created" && (
              <Icon
                color="grey"
                name="hourglass half"
                title="Aguardando confirmação"
                size="large"
              />
            )}
            {app.status === "confirmed" && (
              <Icon
                color="green"
                name="calendar check outline"
                title="Confirmado"
                size="large"
              />
            )}
            {app.status === "canceled" && (
              <Icon
                color="red"
                name="calendar times outline"
                title="Cancelado"
                size="large"
              />
            )}
            {app.status === "done" && (
              <Icon
                name="check square outline"
                color="blue"
                title="Feito"
                size="large"
              />
            )}
            {app.status === "missed" && (
              <Icon
                color="orange"
                name="user times"
                title="Cliente Faltou"
                size="large"
              />
            )}
            {app.status === "payed" && (
              <Icon
                color="teal"
                name="dollar"
                title="Cliente Pagou"
                size="large"
              />
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
                {app.status === "created" && (
                  <>
                    <Button
                      icon
                      color="green"
                      compact
                      title="Confirmar agendamento"
                      onClick={() =>
                        setConfirmationModal(
                          confirmAppointment,
                          app._id,
                          "Tem certeza que deseja confirmar o agendamento?",
                          "O cliente será alertado da cofirmação logo em seguida."
                        )
                      }
                    >
                      <Icon name="check" />
                    </Button>
                    <Link to={"/dashboard/agendamento/id/" + app._id}>
                      <Button
                        icon
                        color="blue"
                        compact
                        title="Ver ou editar agendamento"
                      >
                        <Icon name="edit outline" />
                      </Button>
                    </Link>
                    <Button
                      icon
                      color="red"
                      compact
                      title="Cancelar agendamento"
                      onClick={() =>
                        setConfirmationModal(
                          cancelAppointment,
                          app._id,
                          "Tem certeza que deseja cancelar o agendamento?",
                          "O cliente será alertado do cancelamento e o horário voltará a estar disponível.",
                          "Não Cancelar",
                          "Cancelar Agendamento"
                        )
                      }
                    >
                      <Icon name="delete" />
                    </Button>
                  </>
                )}

                {app.status === "confirmed" && (
                  <>
                    <Link to={"/dashboard/agendamento/id/" + app._id}>
                      <Button
                        icon
                        color="blue"
                        compact
                        title="Ver ou editar agendamento"
                      >
                        <Icon name="edit outline" />
                      </Button>
                    </Link>
                    <Button
                      icon
                      color="red"
                      compact
                      title="Cancelar agendamento"
                      onClick={() =>
                        setConfirmationModal(
                          cancelAppointment,
                          app._id,
                          "Tem certeza que deseja cancelar o agendamento?",
                          "O cliente será alertado do cancelamento e o horário voltará a estar disponível.",
                          "Não Cancelar",
                          "Cancelar Agendamento"
                        )
                      }
                    >
                      <Icon name="delete" />
                    </Button>
                  </>
                )}
                {(app.status === "canceled" ||
                  app.status === "done" ||
                  app.status === "payed" ||
                  app.status === "missed") && (
                  <Link to={"/dashboard/agendamento/id/" + app._id}>
                    <Button icon color="blue" compact title="Ver">
                      <Icon name="search" />
                    </Button>
                  </Link>
                )}
              </>
            )}
            {past && (
              <Link to={"/dashboard/agendamento/id/" + app._id}>
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
      events: undefined,
      activeItem: undefined,
      selectedId: undefined,
      confirmationModal: {
        open: false,
        onCancel: this.cancelConfirmationModal,
        onConfirm: undefined,
        header: "Tem certeza?",
        content: "Tem certeza que deseja fazer isso?",
        cancelButton: "Cancelar",
        confirmButton: "Confirmar"
      },
      newAppointment: {
        start: undefined,
        end: undefined
      }
    };
  }

  cancelConfirmationModal = () => {
    this.setState({
      confirmationModal: {
        ...this.state.confirmationModal,
        open: false
      }
    });
  };

  setConfirmationModal = (
    action,
    id,
    header,
    content,
    cancelButton = "Cancelar",
    confirmButton = "Confirmar"
  ) => {
    const _confirmationModal = {
      ...this.state.confirmationModal,
      open: true,
      onConfirm: action,
      header,
      content,
      cancelButton,
      confirmButton
    };

    this.setState({ selectedId: id, confirmationModal: _confirmationModal });
  };

  setActiveItem = item => {
    this.setState({ activeItem: item }, () => {
      this.mountOrCalendarUpdate();
    });
  };

  setNewAppointment = (start, end) => {
    this.setState(
      {
        newAppointment: {
          start,
          end
        },
        activeItem: "new"
      },
      () => {
        this.props.history.push("/dashboard/agendamentos/novo");
      }
    );
  };

  updateAppointment = appointment => {
    const getAppointments = () => {
      const appointments = [
        ...this.state.before,
        ...this.state.today,
        ...this.state.tomorrow,
        ...this.state.next
      ];
      appointments.forEach(app => {
        if (app._id === appointment._id) {
          app.status = appointment.status;
        }
      });

      return appointments;
    };

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(config.api + "/appointment/update", appointment, requestConfig)
      .then(response => {
        this.sortAppointments(getAppointments());
        toast(
          <Notification
            type="success"
            title="Agendamento atualizado"
            text="O agendamento foi atualizado com sucesso"
          />
        );
      })
      .catch(error => {
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar agendamento"
            text="Erro ao tentar atualizar os agendamento"
          />
        );
      });
  };

  confirmAppointment = () => {
    const _appointment = {
      _id: this.state.selectedId,
      status: "confirmed"
    };

    this.updateAppointment(_appointment);
    this.cancelConfirmationModal();
  };

  cancelAppointment = () => {
    const _appointment = {
      _id: this.state.selectedId,
      status: "canceled"
    };

    this.updateAppointment(_appointment);
    this.cancelConfirmationModal();
  };

  setMinMaxTime = workingDays => {
    let _min = undefined;
    let _max = undefined;
    workingDays.forEach((wd, index) => {
      wd.workingHours.forEach((wh, index) => {
        let _itemMin = moment()
          .hour(wh.start.split(":")[0])
          .minute(wh.start.split(":")[1])
          .second("0");

        let _itemMax = moment()
          .hour(wh.end.split(":")[0])
          .minute(wh.end.split(":")[1])
          .second("0");

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
      if (app.status === "created" || app.status === "confirmed") {
        _events.push({
          title: `${app.costumer.firstName} - ${app.service.desc}`,
          start: new Date(app.start),
          end: new Date(app.end),
          allDay: false,
          appointmentId: app._id,
          disabled: moment(app.start).isBefore(moment(), "hour")
        });
      }
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
      if (!(app.status === "created" || app.status === "confirmed")) {
        _before.push(app);
      } else if (_date.isBefore(_todayDate, "hour")) {
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
    let _activeItem = undefined;
    if (this.props.match.params.option === "calendario") {
      _activeItem = "calendar";
    } else if (this.props.match.params.option === "ativos") {
      _activeItem = "next";
    } else if (this.props.match.params.option === "terminados") {
      _activeItem = "before";
    } else if (this.props.match.params.option === "novo") {
      _activeItem = "new";
    } else {
      _activeItem = "calendar";
    }
    this.setState({ activeItem: _activeItem });
    this.mountOrCalendarUpdate();
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  mountOrCalendarUpdate = () => {
    this.setState({
      loading: true,
      events: undefined
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
  };

  render() {
    const { activeItem, confirmationModal } = this.state;
    return (
      <>
        <Confirm
          open={confirmationModal.open}
          onCancel={confirmationModal.onCancel}
          onConfirm={confirmationModal.onConfirm}
          header={confirmationModal.header}
          content={confirmationModal.content}
          cancelButton={confirmationModal.cancelButton}
          confirmButton={confirmationModal.confirmButton}
        />
        <div>
          <Menu borderless className="pages-menu">
            <Link to="/dashboard/agendamentos/calendario">
              <Menu.Item
                as="span"
                name="calendar"
                active={activeItem === "calendar"}
                onClick={this.handleItemClick}
                icon="calendar alternate outline"
                content="Calendário"
              />
            </Link>
            <Link to="/dashboard/agendamentos/novo">
              <Menu.Item
                as="span"
                name="new"
                active={activeItem === "new"}
                onClick={this.handleItemClick}
                content="Novo Agendamento"
                icon="plus"
              />
            </Link>
            <Link to="/dashboard/agendamentos/ativos">
              <Menu.Item
                as="span"
                name="next"
                active={activeItem === "next"}
                onClick={this.handleItemClick}
                content="Agendamentos Ativos"
                icon="play circle outline"
              />
            </Link>
            <Menu.Menu position="right">
              <Link to="/dashboard/agendamentos/terminados">
                <Menu.Item
                  as="span"
                  name="before"
                  active={activeItem === "before"}
                  onClick={this.handleItemClick}
                  content="Agendamentos Terminados"
                  icon="history"
                />
              </Link>
            </Menu.Menu>
          </Menu>
        </div>
        {this.state.loading && <Loading />}
        {this.state.before.length > 0 && this.state.activeItem === "before" && (
          <>
            <div>
              <FormTitle
                text="Pagos, A Pagar, Cancelados ou Clientes Ausentes"
                first
              />
            </div>
            <Table celled compact>
              <TableHeader />
              <TableBody
                data={this.state.before}
                past={true}
                setConfirmationModal={this.setConfirmationModal}
              />
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
              <TableBody
                data={this.state.today}
                confirmAppointment={this.confirmAppointment}
                cancelAppointment={this.cancelAppointment}
                setConfirmationModal={this.setConfirmationModal}
              />
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
            <Table celled compact>
              <TableHeader />
              <TableBody
                data={this.state.tomorrow}
                confirmAppointment={this.confirmAppointment}
                cancelAppointment={this.cancelAppointment}
                setConfirmationModal={this.setConfirmationModal}
              />
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
            <Table celled compact>
              <TableHeader />
              <TableBody
                data={this.state.next}
                confirmAppointment={this.confirmAppointment}
                cancelAppointment={this.cancelAppointment}
                setConfirmationModal={this.setConfirmationModal}
              />
            </Table>
          </>
        )}
        {this.state.activeItem === "calendar" && (
          <>
            {this.state.events !== undefined && (
              <>
                <Calendar
                  minTime={this.state.minTime}
                  maxTime={this.state.maxTime}
                  events={this.state.events}
                  updateHandler={this.mountOrCalendarUpdate}
                  setNewAppointment={this.setNewAppointment}
                  {...this.props}
                />
              </>
            )}
          </>
        )}
        {this.state.activeItem === "new" && (
          <>
            <NewAppointment
              {...this.props}
              setActiveItem={this.setActiveItem}
              start={this.state.newAppointment.start}
              end={this.state.newAppointment.end}
            />
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
