import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Segment,
  Header,
  Icon,
  Table,
  Button,
  Confirm,
  Divider
} from "semantic-ui-react";
import { toast } from "react-toastify";
import moment from "moment";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loading from "../Loading/Loading";
import Axios from "axios";
import config from "../../config";
import _ from "lodash";
import Notification from "../Notification/Notification";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const AppointmentRow = styled(Table.Row)`
  background: ${props => props.bgcolor} !important;
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
      <Table.HeaderCell width={4}>Serviço</Table.HeaderCell>
      <Table.HeaderCell width={4}>Especialista</Table.HeaderCell>
      {/* <Table.HeaderCell width={3}>Cliente</Table.HeaderCell> */}
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
  let _fullDate = undefined;

  _fullDate = true;
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
          {/* <Table.Cell
            title={app.costumer.firstName + " " + app.costumer.lastName}
          >
            {app.costumer.firstName + " " + app.costumer.lastName}
          </Table.Cell> */}
          <Table.Cell
            title={
              moment(app.start).format("dddd, DD/MM/YYYY[ - ]HH:mm") +
              " às " +
              moment(app.end).format("HH:mm")
            }
          >
            {_fullDate && (
              <>
                {moment(app.start).format("dd DD/MM/YY[ - ]HH:mm") +
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
                  color="blue"
                  inverted
                  compact
                  title="Visualizar agendamento"
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
    this.state = {
      confirmationModal: {
        open: false,
        onCancel: this.cancelConfirmationModal,
        onConfirm: undefined,
        header: "Tem certeza?",
        content: "Tem certeza que deseja fazer isso?",
        cancelButton: "Cancelar",
        confirmButton: "Confirmar"
      },
      loading: false,
      appointments: []
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

  mountOrUpdate = () => {
    this.setState({
      loading: true,
      events: undefined
    });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/appointments/clientlist",
      { id: this.props.match.params.id },
      requestConfig
    )
      .then(response => {
        _.reverse(response.data.appointments);
        this.setState({
          loading: false,
          appointments: response.data.appointments
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.mountOrUpdate();
  }

  updateAppointment = appointment => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(config.api + "/appointment/update", appointment, requestConfig)
      .then(response => {
        toast(
          <Notification
            type="success"
            title="Agendamento atualizado"
            text="O agendamento foi atualizado com sucesso"
          />
        );
        this.mountOrUpdate();
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

  render() {
    const { confirmationModal } = this.state;
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
        {this.state.loading && <Loading />}
        {this.state.appointments.length === 0 && (
          <NoAppointments text="Não há agendamentos" />
        )}
        {this.state.appointments.length > 0 && (
          <Table fixed singleLine striped compact>
            <TableHeader />
            <TableBody
              data={this.state.appointments}
              past={false}
              setConfirmationModal={this.setConfirmationModal}
              confirmAppointment={this.confirmAppointment}
              cancelAppointment={this.cancelAppointment}
            />
          </Table>
        )}
        <Divider style={{ marginTop: "40px" }} />

        <Button
          icon
          labelPosition="left"
          onClick={() => this.props.history.goBack()}
        >
          <Icon name="arrow left" />
          Voltar
        </Button>
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointments);
