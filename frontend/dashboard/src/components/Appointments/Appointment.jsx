import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { setCurrentPage } from "../dashboardActions";
import Axios from "axios";
import config from "../../config";
import moment from "moment";
import Loading from "../Loading/Loading";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import { formatBrazilianPhoneNumber, formatCurrency } from "../utils";
import { Icon, Button, Divider, Confirm } from "semantic-ui-react";
import Notification from "../Notification/Notification";
import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const AppointmentNotes = styled.p`
  line-height: 20px;
  max-width: 450px;
`;

const Label = styled.span`
  opacity: 0.8;
`;

const WhatsApp = styled.span`
  margin-left: 10px;
  font-weight: 700;
  color: #19b719;
`;

const StyledStatus = styled.h3`
  opacity: 0.8;
  font-weight: 400;
  margin-bottom: 25px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 50%;
  }
`;
/* ============================================================================ */

const Status = ({ status }) => (
  <>
    <StyledStatus>
      {status === "canceled" && (
        <>
          <Icon name="calendar times outline" />
          Cancelado
        </>
      )}
      {status === "created" && (
        <>
          <Icon name="hourglass half" />
          Aguardando confirmação
        </>
      )}
      {status === "confirmed" && (
        <>
          <Icon name="calendar check outline" />
          Confirmado
        </>
      )}
      {status === "done" && (
        <>
          <Icon name="check square outline" />
          Concluído
        </>
      )}
      {status === "missed" && (
        <>
          <Icon name="user times" style={{ marginRight: "10px" }} />
          Cliente faltou
        </>
      )}
      {status === "payed" && (
        <>
          <Icon name="dollar" />
          Pago
        </>
      )}
    </StyledStatus>
  </>
);

const ConfirmButton = ({ value, onClick }) => (
  <Button
    color="green"
    onClick={onClick}
    id="confirmed"
    value={value}
    icon
    labelPosition="left"
    compact
  >
    <Icon name="calendar check outline" />
    Confirmar Agendamento
  </Button>
);

const CancelButton = ({ value, onClick }) => (
  <Button
    color="red"
    onClick={onClick}
    id="canceled"
    value={value}
    icon
    labelPosition="left"
    compact
  >
    <Icon name="calendar times outline" />
    Cancelar Agendamento
  </Button>
);

const CompleteButton = ({ value, onClick }) => (
  <Button
    color="blue"
    onClick={onClick}
    id="done"
    value={value}
    icon
    labelPosition="left"
    compact
  >
    <Icon name="check" />
    Concluir Agendamento
  </Button>
);

const MissButton = ({ value, onClick }) => (
  <Button
    color="orange"
    onClick={onClick}
    id="missed"
    value={value}
    icon
    labelPosition="left"
    compact
  >
    <Icon name="user times" />
    Cliente Faltou
  </Button>
);

const PayButton = ({ value, onClick }) => (
  <Button
    color="teal"
    onClick={onClick}
    id="payed"
    value={value}
    icon
    labelPosition="left"
    compact
  >
    <Icon name="dollar" />
    Cliente Pagou
  </Button>
);

const StatusButtons = ({
  status,
  appointmentId,
  setStatus,
  inThePast,
  setConfirmationModal
}) => {
  return (
    <>
      {status === "created" && (
        <>
          <ConfirmButton
            onClick={() =>
              setConfirmationModal(
                setStatus,
                appointmentId,
                "confirmed",
                "Tem certeza?",
                "Tem certeza que deseja mudar o status para confirmado?"
              )
            }
          />
          <CancelButton
            onClick={() =>
              setConfirmationModal(
                setStatus,
                appointmentId,
                "canceled",
                "Tem certeza?",
                "Tem certeza que deseja mudar o status para cancelado?"
              )
            }
          />
        </>
      )}
      {status === "confirmed" && (
        <>
          {inThePast && (
            <>
              <CompleteButton
                onClick={() =>
                  setConfirmationModal(
                    setStatus,
                    appointmentId,
                    "done",
                    "Tem certeza?",
                    "Tem certeza que deseja mudar o status para concluído?"
                  )
                }
              />
              <MissButton
                onClick={() =>
                  setConfirmationModal(
                    setStatus,
                    appointmentId,
                    "missed",
                    "Tem certeza?",
                    "Tem certeza que deseja informar que o cliente faltou?"
                  )
                }
              />
            </>
          )}
          <CancelButton
            onClick={(status, value) =>
              setConfirmationModal(
                setStatus,
                appointmentId,
                "canceled",
                "Tem certeza?",
                "Tem certeza que deseja mudar o status para cancelado?"
              )
            }
          />
        </>
      )}
      {status === "done" && inThePast && (
        <>
          <PayButton
            onClick={(status, value) =>
              setConfirmationModal(
                setStatus,
                appointmentId,
                "payed",
                "Tem certeza?",
                "Tem certeza que deseja informar que o cliente pagou?"
              )
            }
          />
        </>
      )}
    </>
  );
};

export class Appointment extends Component {
  state = {
    loading: false,
    appointmentId: "",
    appointmentStatus: undefined,
    appointment: undefined,
    inThePast: false,
    confirmationModal: {
      open: false,
      onCancel: undefined,
      onConfirm: undefined,
      header: "Tem certeza?",
      content: "Tem certeza que deseja fazer isso?",
      cancelButton: "Cancelar",
      confirmButton: "Confirmar"
    }
  };

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
    status,
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
      confirmButton,
      onCancel: this.cancelConfirmationModal
    };

    this.setState({
      appointmentId: id,
      appointmentStatus: status,
      confirmationModal: _confirmationModal
    });
  };

  updateAppointment = appointment => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(config.api + "/appointment/update", appointment, requestConfig)
      .then(response => {
        this.setState({
          ...this.state,
          appointment: { ...this.state.appointment, status: appointment.status }
        });
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

  setStatus = () => {
    let _appointment = {
      _id: this.state.appointmentId,
      status: this.state.appointmentStatus
    };
    this.updateAppointment(_appointment);
    this.cancelConfirmationModal();
  };

  componentDidMount() {
    this.setState({
      appointmentId: this.props.match.params.id,
      loading: true
    });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/appointments/get",
      { id: this.props.match.params.id },
      requestConfig
    )
      .then(response => {
        const { firstName, lastName } = response.data.appointment.costumer;
        const { start, end } = response.data.appointment;

        const _inThePast = moment(start).isBefore(moment(), "minute");

        this.props.setCurrentPage({
          title: `${firstName} ${lastName}`,
          subtitle: `${moment(start).format(
            "dddd, DD[ de ]MMMM[, de ]HH:mm"
          )} às ${moment(end).format("HH:mm")}`,
          icon: "user"
        });
        this.setState({
          loading: false,
          appointment: response.data.appointment,
          appointmentId: response.data.appointment._id,
          appointmentStatus: response.data.appointment.status,
          inThePast: _inThePast
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { appointment, confirmationModal } = this.state;
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
          {this.state.loading && <Loading />}
          {this.state.appointment !== undefined && (
            <>
              <FormTitle text="Status" first />

              <Status status={appointment.status} />
              <StatusButtons
                status={appointment.status}
                appointmentId={this.state.appointmentId}
                setConfirmationModal={this.setConfirmationModal}
                setStatus={this.setStatus}
                inThePast={this.state.inThePast}
              />

              <FormTitle text="Informações do Agendamento" />
              <Info>
                <div>
                  <FormSubTitle text="Cliente" first />
                  <p>
                    <Label>Nome: </Label>
                    {appointment.costumer.firstName +
                      " " +
                      appointment.costumer.lastName}
                  </p>
                  <p>
                    <Label>Sexo: </Label>
                    {appointment.costumer.gender === "F" ? "Feminino" : ""}
                    {appointment.costumer.gender === "M" ? "Masculino" : ""}
                    {appointment.costumer.gender === "O" ? "Outro" : ""}
                  </p>
                  <p>
                    <Label>Email: </Label>
                    {appointment.costumer.email}
                  </p>
                  <p>
                    <Label>Telefone: </Label>
                    {formatBrazilianPhoneNumber(
                      appointment.costumer.phone[0].number
                    )}
                    <WhatsApp>
                      {appointment.costumer.phone[0].whatsApp ? (
                        <>
                          WhatsApp
                          <Icon name="whatsapp" size="large" />
                        </>
                      ) : (
                        ""
                      )}
                    </WhatsApp>
                  </p>
                  {appointment.notes && (
                    <AppointmentNotes>
                      <Label>Observações do cliente: </Label>
                      {appointment.notes}
                    </AppointmentNotes>
                  )}
                  <FormSubTitle text="Serviço" />
                  <p>
                    <Label>Descrição: </Label>
                    {appointment.service.desc}
                  </p>
                  <p>
                    <Label>Duração: </Label>
                    {appointment.service.duration} minutos
                  </p>
                  <p>
                    <Label>Valor: </Label>
                    R$ {formatCurrency(appointment.service.value)}
                  </p>
                </div>
                <div>
                  <FormSubTitle text="Data e Hora" first />
                  <p>
                    <Label>Data: </Label>
                    {moment(appointment.start).format("dddd, DD/MM/YYYY")}
                  </p>
                  <p>
                    <Label>Horário: </Label>
                    {moment(appointment.start).format("HH:mm")} às{" "}
                    {moment(appointment.end).format("HH:mm")}
                  </p>
                  <FormSubTitle text="Especialista" />
                  <p>
                    <Label>Nome: </Label>
                    {appointment.user.firstName +
                      " " +
                      appointment.user.lastName}
                  </p>
                  <p>
                    <Label>Especialidade: </Label>
                    {appointment.employee.title}
                  </p>
                </div>
              </Info>
            </>
          )}
        </div>

        <Divider style={{ marginTop: "40px" }} />
        <Button icon labelPosition="left" onClick={this.props.history.goBack}>
          <Icon name="left arrow" />
          Voltar
        </Button>
        {/* <pre>{JSON.stringify(this.state.appointment, null, 2)}</pre> */}
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
)(Appointment);
