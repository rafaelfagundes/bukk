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
  Confirm
} from "semantic-ui-react";
import moment from "moment";
import _ from "lodash";
import Loading from "../Loading/Loading";
import Calendar from "./Calendar";
import Notification from "../Notification/Notification";
import NewAppointment from "./NewAppointment";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import styled from "styled-components";

const OutdatedMessage = props => {
  if (props.count === 1) {
    return (
      <StyledOutdatedMessage>
        <Icon name="warning sign" />
        Há 1 agendamento com status desatualizado.
      </StyledOutdatedMessage>
    );
  } else {
    return (
      <StyledOutdatedMessage>
        <Icon name="warning sign" />
        {`Há ${props.count} agendamentos com status desatualizados.`}
      </StyledOutdatedMessage>
    );
  }
};

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const AppointmentRow = styled(Table.Row)`
  background: ${props => props.bgcolor} !important;
`;

const StyledOutdatedMessage = styled.div`
  color: #fff;
  background-color: #f2711c;
  margin: 0px 0px 20px 0;
  padding: 10px;
  border-radius: 4px;
  font-weight: 700;
`;

// Helper Functions
const getAppointmentBgColor = status => {
  switch (status) {
    case "canceled":
      return "rgba(255,0,0,0.08)";
    case "confirmed":
      return "rgba(0, 128, 0, 0.08)";
    case "done":
      return "rgba(0, 0, 255, 0.08)";
    case "payed":
      return "rgba(0, 128, 128, 0.08)";
    case "missed":
      return "rgba(255, 166, 0, 0.08)";
    default:
      break;
  }
};

/* ============================================================================ */

/* ===============================================================================
  GLOBALS
=============================================================================== */

const menuItems = [
  {
    id: "new",
    icon: "plus",
    text: "Novo Agendamento",
    link: "/dashboard/agendamentos/novo"
  },
  {
    id: "calendar",
    icon: "calendar alternate outline",
    text: "Calendário",
    link: "/dashboard/agendamentos/calendario"
  },
  {
    id: "next",
    icon: "clock outline",
    text: "Próximos Agendamentos",
    link: "/dashboard/agendamentos/futuros"
  },
  {
    id: "closed",
    icon: "history",
    text: "Agendamentos Terminados",
    link: "/dashboard/agendamentos/terminados",
    right: true
  }
];

/* ============================================================================ */

/* ===============================================================================
  COMPONENTS
=============================================================================== */

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
      <Table.HeaderCell width={1}>Status</Table.HeaderCell>
      <Table.HeaderCell width={3}>Serviço</Table.HeaderCell>
      <Table.HeaderCell width={3}>Especialista</Table.HeaderCell>
      <Table.HeaderCell width={3}>Cliente</Table.HeaderCell>
      <Table.HeaderCell width={4}>Data/Horário</Table.HeaderCell>
      <Table.HeaderCell width={2} />
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
  function getFullDate(start, end) {
    return (
      moment(start).format("dddd, DD/MM/YYYY[ - ]HH:mm") +
      " às " +
      moment(end).format("HH:mm")
    );
  }

  function getDate(start, end, status) {
    const _fullDate =
      moment(start).format("ddd, DD/MM/YYYY[ - ]HH:mm") +
      " às " +
      moment(end).format("HH:mm");
    const _shortDate =
      moment(start).format("HH:mm") + " às " + moment(end).format("HH:mm");

    if (status === "canceled") {
      return _fullDate;
    } else if (moment().isSame(moment(start), "day")) {
      return _shortDate;
    } else if (
      moment()
        .add(1, "day")
        .isSame(moment(start), "day")
    ) {
      return _shortDate;
    } else {
      return _fullDate;
    }
  }

  return (
    <Table.Body>
      {data.map((app, index) => (
        <AppointmentRow key={index} bgcolor={getAppointmentBgColor(app.status)}>
          <Table.Cell width={1} textAlign="left">
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
          <Table.Cell width={6} title={app.service.desc}>
            {app.service.desc}
          </Table.Cell>
          <Table.Cell title={app.user.firstName + " " + app.user.lastName}>
            {app.user.firstName + " " + app.user.lastName}
          </Table.Cell>
          <Table.Cell
            title={app.costumer.firstName + " " + app.costumer.lastName}
          >
            {app.costumer.firstName + " " + app.costumer.lastName}
          </Table.Cell>
          <Table.Cell title={getFullDate(app.start, app.end)}>
            {getDate(app.start, app.end, app.status)}
          </Table.Cell>
          <Table.Cell textAlign="right">
            {!past && (
              <>
                {app.status === "created" && (
                  <>
                    <Button
                      icon
                      color="green"
                      compact
                      title="Confirmar agendamento"
                      inverted
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
                        compact
                        title="Ver ou editar agendamento"
                        color="blue"
                        inverted
                      >
                        <Icon name="edit outline" />
                      </Button>
                    </Link>
                    <Button
                      icon
                      compact
                      title="Cancelar agendamento"
                      color="red"
                      inverted
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
                        inverted
                      >
                        <Icon name="edit outline" />
                      </Button>
                    </Link>
                    <Button
                      icon
                      color="red"
                      compact
                      title="Cancelar agendamento"
                      inverted
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
                    <Button icon color="blue" compact title="Ver" inverted>
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
                  color={
                    app.status === "confirmed" || app.status === "created"
                      ? "orange"
                      : "blue"
                  }
                  inverted={
                    app.status === "confirmed" || app.status === "created"
                      ? false
                      : true
                  }
                  compact
                  title={
                    app.status === "confirmed" || app.status === "created"
                      ? "(Desatualizado) Visualizar agendamento"
                      : "Visualizar agendamento"
                  }
                >
                  <Icon name="search" />
                </Button>
              </Link>
            )}
          </Table.Cell>
        </AppointmentRow>
      ))}
    </Table.Body>
  );
};
/* ============================================================================ */

export class Appointments extends Component {
  constructor(props) {
    super(props);
    let _company = JSON.parse(localStorage.getItem("company"));
    const { min, max } = this.setMinMaxTime(_company.workingDays);

    let _activeItem = undefined;
    if (this.props.match.params.option === "calendario") {
      _activeItem = "calendar";
    } else if (this.props.match.params.option === "futuros") {
      _activeItem = "next";
    } else if (this.props.match.params.option === "terminados") {
      _activeItem = "closed";
    } else if (this.props.match.params.option === "novo") {
      _activeItem = "new";
    } else {
      _activeItem = "calendar";
    }

    this.state = {
      loading: false,
      before: [],
      today: [],
      tomorrow: [],
      next: [],
      minTime: min.toDate(),
      maxTime: max.toDate(),
      events: undefined,
      activeItem: _activeItem,
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
      },
      outdatedAppointments: 0
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

    // Count outdated appointments

    let _outdated = 0;
    _before.forEach(b => {
      if (b.status === "created" || b.status === "confirmed") {
        _outdated++;
      }
    });

    // Sorts previous appointments descending
    _.reverse(_before);

    this.setState({
      before: _before,
      today: _today,
      tomorrow: _tomorrow,
      next: _next,
      outdatedAppointments: _outdated
    });
  };

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

  componentDidMount() {
    this.mountOrCalendarUpdate();
  }

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
          size="tiny"
        />
        <div>
          <ComponentTopMenu
            link
            items={menuItems}
            onClick={this.setActiveItem}
            activeItem={activeItem}
          />
        </div>

        {this.state.loading && <Loading />}
        {this.state.before.length > 0 && this.state.activeItem === "closed" && (
          <>
            {this.state.outdatedAppointments > 0 && (
              <OutdatedMessage count={this.state.outdatedAppointments} />
            )}
            <div>
              <FormTitle text="Agendamentos Terminados" first />
            </div>
            <Table fixed singleLine striped compact>
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
          this.state.activeItem === "closed" && (
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
            <Table fixed singleLine striped compact>
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
            <Table fixed singleLine striped compact>
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
            <Table fixed singleLine striped compact>
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
            {this.state.events && (
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
            {!this.state.events && (
              <NoAppointments text="Não há agendamentos" />
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
