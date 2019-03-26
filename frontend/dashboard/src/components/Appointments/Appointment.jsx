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
import {
  Icon,
  Button,
  Divider,
  Confirm,
  Modal,
  Select
} from "semantic-ui-react";
import Notification from "../Notification/Notification";
import styled from "styled-components";
import DatePicker from "react-datepicker";

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

const TwoColumns = styled.div`
  display: flex;
  flex-direction: row;

  > div:first-child {
    margin-right: 20px;
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
    dateTimeModal: false,
    confirmationModal: {
      open: false,
      onCancel: undefined,
      onConfirm: undefined,
      header: "Tem certeza?",
      content: "Tem certeza que deseja fazer isso?",
      cancelButton: "Cancelar",
      confirmButton: "Confirmar"
    },
    appointmentModal: {
      times: [],
      excludeDates: []
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
          inThePast: _inThePast,
          appointmentModal: {
            ...this.state.appointmentModal,
            oldStartTime: start,
            oldEndTime: end
          }
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  loadSchedule = date => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/specialists/schedule",
      {
        employeeId: this.state.appointment.employee._id,
        date: moment(date).format("YYYY-MM"),
        duration: this.state.appointment.service.duration
      },
      requestConfig
    )
      .then(response => {
        const { dates, times } = response.data;

        const _dates = dates.map(date => {
          return moment(date).toDate();
        });

        const _times = [];
        times.forEach(time => {
          if (
            moment(time).isSame(moment(this.state.appointment.start), "day")
          ) {
            _times.push({
              key: time,
              value: time,
              text: moment(time).format("HH:mm")
            });
          }
        });
        this.setState({
          appointmentModal: {
            ...this.state.appointmentModal,
            excludeDates: _dates,
            times: _times
          }
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  toggleDateTimeChange = () => {
    this.loadSchedule(this.state.appointment.start);
    this.setState({ dateTimeModal: !this.state.dateTimeModal });
  };

  closeDateTimeChange = () => {
    this.setState({
      dateTimeModal: false,
      appointment: {
        ...this.state.appointment,
        start: this.state.appointmentModal.oldStartTime,
        end: this.state.appointmentModal.oldEndTime
      }
    });
  };

  changeAppointmentDate = e => {
    this.setState(
      {
        appointment: {
          ...this.state.appointment,
          start: e
        }
      },
      () => {
        this.loadSchedule(e);
      }
    );
  };

  changeAppointmentTime = (e, { value }) => {
    let _date = moment(this.state.appointment.start);
    const _newTime = moment(value);

    _date = _date.hour(_newTime.format("HH")).minute(_newTime.format("mm"));

    this.setState({
      appointment: {
        ...this.state.appointment,
        start: _date.toDate(),
        end: _date
          .add(this.state.appointment.service.duration, "minute")
          .toDate()
      }
    });
  };

  updateAppointmentDateTime = () => {
    const _appointment = {
      _id: this.state.appointment._id,
      start: this.state.appointment.start,
      end: this.state.appointment.end,
      status: this.state.appointment.status
    };

    this.updateAppointment(_appointment);
    this.setState({ dateTimeModal: false });
  };

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
          size="tiny"
        />

        <Modal
          size="tiny"
          open={this.state.dateTimeModal}
          onClose={this.closeDateTimeChange}
        >
          <Modal.Header>Alterar Data e Hora do Agendamento</Modal.Header>
          {this.state.appointment && (
            <Modal.Content>
              <TwoColumns>
                <div>
                  <DatePicker
                    selected={moment(this.state.appointment.start).toDate()}
                    onChange={this.changeAppointmentDate}
                    inline
                    locale="pt-BR"
                    excludeDates={this.state.appointmentModal.excludeDates}
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <FormSubTitle text="Hora" first />
                  <Select
                    placeholder="Selecione a hora"
                    options={this.state.appointmentModal.times}
                    onChange={this.changeAppointmentTime}
                  />
                </div>
              </TwoColumns>
            </Modal.Content>
          )}
          <Modal.Actions>
            <Button
              icon="delete"
              content="Cancelar"
              onClick={this.closeDateTimeChange}
            />
            <Button
              positive
              icon="checkmark"
              content="Alterar"
              onClick={this.updateAppointmentDateTime}
            />
          </Modal.Actions>
        </Modal>
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
                  {(this.state.appointment.status === "created" ||
                    this.state.appointment.status === "confirmed") && (
                    <Button
                      content="Alterar Data e Hora"
                      icon="edit"
                      compact
                      size="small"
                      onClick={this.toggleDateTimeChange}
                    />
                  )}
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
