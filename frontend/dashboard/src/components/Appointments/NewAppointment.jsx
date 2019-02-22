import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "react-spinkit";
import DatePicker, { registerLocale } from "react-datepicker";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Axios from "axios";
import {
  Form,
  Icon,
  Button,
  Checkbox,
  Divider,
  Radio,
  Segment,
  Header
} from "semantic-ui-react";
import _ from "lodash";
import styled from "styled-components";
import { formatCurrency } from "../utils";
import moment from "moment";
import config from "../../config";
import { formatBrazilianPhoneNumber } from "../utils";
import validation from "../validation";

import ptBR from "date-fns/locale/pt";
import ValidationError from "../Common/ValidationError";
import Notification from "../Notification/Notification";

ptBR.options.weekStartsOn = 0;
registerLocale("pt-BR", ptBR);

/* ===============================================================================
  STYLED COMPONENTES
=============================================================================== */
const StyledFormGroup = styled(Form.Group)`
  display: flex !important;
  flex-direction: column !important;
`;

const StyledDropDown = styled(Form.Dropdown)`
  min-width: 400px;
  margin-bottom: 0px !important;
`;

const ServiceDescWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const ServiceDescItemFirst = styled.div`
  margin: 0px 15px 0 5px;
`;

const Columns = styled.div`
  display: flex;
  flex-direction: row;
`;

const DateColumn = styled.div`
  width: 249px;
`;

const TimeColumn = styled.div`
  width: 137px;
`;

const TimeDropDown = styled(Form.Dropdown)`
  margin-bottom: 0px !important;
`;

const ServiceColumn = styled.div`
  width: 40%;
  margin-right: 40px;
`;

const ClientColumn = styled.div`
  width: 60%;
  padding-left: 40px;
  border-left: 1px solid #eee;
`;

const TimesUnavailable = styled.div`
  font-weight: 400;
  font-style: italic;
  opacity: 0.8;
`;

const ClientAddButtonColumn = styled.div`
  width: 30%;
`;

const AddClientButton = styled(Button)`
  height: 38px;
  margin: 0;
`;

const ClientFormSpacer = styled.div`
  height: 40px;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-top: 30px;
  margin-left: 10px;
`;

const StyledDivider = styled(Divider)`
  margin-top: 40px !important;
`;

const StyledFormTitle = styled.div`
  font-size: 1.1rem;
  padding: 20px 0px 5px;
  margin: 40px 0px 10px;
  font-weight: 600;
  color: rgb(85, 85, 85);
  border-top: 1px solid #eee;
`;

const StyledSegment = styled(Segment)`
  min-height: 0px !important;

  > .header {
    padding-top: 18px;
  }
`;

const StyledSegmentClient = styled(Segment)`
  height: 404px;
  > .header {
    padding-top: 18px;
  }
`;

/* ============================================================================ */

/* ===============================================================================
  TEMPLATES
=============================================================================== */
const _clientTemplate = {
  firstName: "",
  lastName: "",
  gender: "O",
  email: "",
  phone: "",
  whatsApp: false
};
/* ============================================================================ */

export class NewAppointment extends Component {
  constructor(props) {
    super(props);

    const _company = JSON.parse(localStorage.getItem("company"))._id;
    const _user = JSON.parse(localStorage.getItem("user"))._id;

    let _employee = undefined;
    let _isSpecialist = false;

    if (localStorage.getItem("employee")) {
      _employee = JSON.parse(localStorage.getItem("employee"))._id;
      _isSpecialist = true;
    }

    this.state = {
      loading: false,
      created: false,
      appointment: {
        consumer: undefined,
        employee: _employee,
        company: _company,
        service: undefined,
        start: new Date(),
        end: undefined,
        status: "created",
        notes: undefined
      },
      user: _user,
      services: [],
      servicesDropdown: [],
      selectedService: undefined,
      isSpecialist: _isSpecialist,
      specialists: [],
      specialistDropdown: [],
      selectedSpecialist: _employee,
      selectedDate: new Date(),
      calendar: undefined,
      timesDropdown: [],
      clientSelectedOrNew: false,
      clients: [],
      clientsDropdown: [],
      selectedClient: undefined,
      client: _clientTemplate,
      notes: "",
      isNewClient: false,
      errors: {
        appointment: [],
        client: []
      },
      defaultTime: undefined
    };
  }

  resetAppointment = () => {
    const _company = JSON.parse(localStorage.getItem("company"))._id;
    let _employee = undefined;
    if (localStorage.getItem("employee")) {
      _employee = JSON.parse(localStorage.getItem("employee"))._id;
    }

    const _appointment = {
      consumer: undefined,
      employee: _employee,
      company: _company,
      service: undefined,
      start: new Date(),
      end: undefined,
      status: "created",
      notes: undefined
    };

    this.setState({ appointment: _appointment });
  };

  getEmployee = id => {
    return _.find(this.state.specialists, function(o) {
      return o._id === id;
    });
  };

  getClient = id => {
    return _.find(this.state.clients, function(o) {
      return o._id === id;
    });
  };

  getTimeInDropDown = () => {
    if (this.props.start) {
      let _selected = moment(this.props.start).format("HH:mm");

      const result = _.find(this.state.timesDropdown, function(o) {
        const _time = moment(JSON.parse(o.value)).format("HH:mm");
        return _time === _selected;
      });

      if (result) {
        this.setState({ defaultTime: result.value });
      }
    }
  };

  toggleClientForm = value => {
    this.setState({
      clientSelectedOrNew: value
    });
  };

  handleClient = (e, { value }) => {
    const _client = this.getClient(value);

    const _clientState = {
      firstName: _client.firstName,
      lastName: _client.lastName,
      email: _client.email,
      phone: _client.phone[0].number,
      whatsApp: _client.phone[0].whatsApp,
      gender: _client.gender
    };

    this.setState({
      selectedClient: _client,
      client: _clientState,
      isNewClient: false
    });
    this.setAppointment({ costumer: _client._id });

    this.toggleClientForm(true);
  };

  handleClientInput = (e, key, type, object = undefined) => {
    const _client = JSON.parse(JSON.stringify(this.state.client));
    let _value = undefined;

    if (type === "text") {
      _value = e.currentTarget.value;
    }
    if (type === "checkbox") {
      _value = object.checked;
    }
    if (type === "radio") {
      _value = object.value;
    }
    _client[key] = _value;
    this.setState({ client: _client });
  };

  handleNotesInput = e => {
    this.setState({ notes: e.currentTarget.value });
    this.setAppointment({ notes: e.currentTarget.value });
  };

  handleNewClient = e => {
    e.preventDefault();
    this.setState({
      client: _clientTemplate,
      isNewClient: true,
      selectedClient: undefined
    });
    this.toggleClientForm(true);
  };

  handleSearchClient = e => {
    this.setState({ clientSelectedOrNew: false });
  };

  setServicesDropdown = services => {
    let _services = [];
    services.forEach(s => {
      _services.push({
        key: s._id,
        value: s._id,
        text: s.desc
      });
    });

    this.setState({ servicesDropdown: _.sortBy(_services, ["text"]) });
  };

  setSpecialistsDropdown = specialists => {
    let _specialists = [];
    specialists.forEach(s => {
      _specialists.push({
        key: s._id,
        value: s._id,
        text: `${s.firstName} ${s.lastName} - ${s.employee.title}`,
        image: {
          avatar: true,
          src: s.avatar
        }
      });
    });

    this.setState({ specialistDropdown: _.sortBy(_specialists, ["text"]) });
  };

  setClientsDropdown = clients => {
    let _clients = [];
    clients.forEach(c => {
      _clients.push({
        key: c._id,
        value: c._id,
        text: `${c.firstName} ${c.lastName} / ${c.email}`
      });
    });

    this.setState({ clientsDropdown: _.sortBy(_clients, ["text"]) });
  };

  setTimesDropdown = () => {
    let _times = [];
    let _date = moment(this.state.selectedDate);

    this.state.calendar.times.forEach((t, index) => {
      if (_date.isSame(moment(t), "day")) {
        _times.push({
          key: index,
          value: JSON.stringify(moment(t)),
          text: moment(t).format("HH:mm")
        });
      }
    });
    this.setState({ timesDropdown: _times }, () => {
      this.getTimeInDropDown();
    });
  };

  setAppointment = item => {
    let _appointment = JSON.parse(JSON.stringify(this.state.appointment));

    Object.keys(item).forEach(key => {
      _appointment = {
        ..._appointment,
        [key]: item[key]
      };
    });

    this.setState({
      appointment: _appointment
    });
  };

  handleService = (e, { value }) => {
    this.resetAppointment();
    this.setState({
      selectedService: undefined
    });

    const service = _.find(this.state.services, { _id: value });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/specialists/service",
      { serviceId: value },
      requestConfig
    )
      .then(response => {
        this.setState(
          {
            specialists: response.data,
            calendar: undefined,
            selectedService: {
              value: service.value,
              duration: service.duration
            }
          },
          () => {
            if (this.state.isSpecialist) {
              this.handleSpecialist(null, {
                value: this.state.user
              });
            } else {
              this.setSpecialistsDropdown(response.data);
            }
            this.setAppointment({
              service: value
            });
          }
        );
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  handleSpecialist = (e, { value }) => {
    this.setState({ selectedSpecialist: value, calendar: undefined });

    const { employee } = this.getEmployee(value);
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/specialists/schedule",
      {
        employeeId: employee._id,
        date: moment(this.state.selectedDate).format("YYYY-MM"),
        duration: this.state.selectedService.duration
      },
      requestConfig
    )
      .then(response => {
        const { dates, times } = response.data;

        this.setState(
          {
            calendar: {
              dates,
              times
            }
          },
          () => {
            this.setTimesDropdown();
            this.setAppointment({ employee: employee._id });
          }
        );
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  handleDate = e => {
    this.setState({ selectedDate: e }, () => {
      this.setTimesDropdown();
      this.setAppointment({ start: e, end: undefined });
    });
  };

  handleTime = (e, { value }) => {
    this.setState({ selectedDate: moment(JSON.parse(value)).toDate() }, () => {
      let _dateTime = moment(this.state.selectedDate);
      this.setAppointment({
        start: _dateTime.toDate(),
        end: _dateTime
          .add(this.state.selectedService.duration, "minute")
          .toDate()
      });
    });
  };

  handleMonthChange = e => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/specialists/schedule",
      {
        userId: this.state.selectedSpecialist,
        date: moment(e).format("YYYY-MM"),
        duration: this.state.selectedService.duration
      },
      requestConfig
    )
      .then(response => {
        const { dates, times } = response.data;
        this.setState(
          {
            calendar: {
              dates,
              times
            }
          },
          () => {
            this.setTimesDropdown();
          }
        );
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  validate = () => {
    const validateAppointment = () => {
      const { appointment } = this.state;

      const _errors = [];

      if (!appointment.service) {
        _errors.push("Selecione o serviço");
      }
      if (!appointment.employee) {
        _errors.push("Selecione o especialista");
      }
      if (!appointment.end) {
        _errors.push("Selecione um horário");
      }

      return _errors;
    };

    const validateClient = () => {
      const { client } = this.state;

      const _errors = [];

      if (validation.isEmpty(client.firstName)) {
        _errors.push("O nome é obrigatório");
      } else {
        if (!validation.isAlpha(client.firstName)) {
          _errors.push("O nome é inválido");
        }
      }

      if (validation.isEmpty(client.lastName)) {
        _errors.push("O sobrenome é obrigatório");
      } else {
        if (!validation.isAlpha(client.lastName)) {
          _errors.push("O sobrenome é inválido");
        }
      }

      if (validation.isEmpty(client.email)) {
        _errors.push("O email é obrigatório");
      } else {
        if (!validation.isEmail(client.email)) {
          _errors.push("O email é inválido");
        }
      }

      if (validation.isEmpty(client.email)) {
        _errors.push("O telefone é obrigatório");
      } else {
        if (
          !validation.isPhoneWithDDD(client.phone) &&
          !validation.isMobilePhoneWithDDD(client.phone)
        ) {
          _errors.push("O telefone é inválido");
        }
      }

      return _errors;
    };

    const _client = validateClient();
    const _app = validateAppointment();

    if (_client.length || _app.length) {
      this.setState({
        errors: {
          client: _client,
          appointment: _app
        }
      });
      return false;
    } else {
      this.setState({
        errors: {
          client: [],
          appointment: []
        }
      });
    }

    return true;
  };

  createAppointment = e => {
    e.preventDefault();

    if (!this.validate()) {
      return false;
    } else {
      this.setState({ loading: true });
      const _appointment = JSON.parse(JSON.stringify(this.state.appointment));

      const _data = {
        appointment: _appointment,
        isNewClient: this.state.isNewClient,
        client: this.state.client
      };

      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };

      _data.client.phone = _data.client.phone.replace(/\D/g, "");
      console.log("phone", _data.client.phone);

      Axios.post(config.api + "/appointment", _data, requestConfig)
        .then(response => {
          toast(
            <Notification
              type="success"
              title="Agendamento criado com sucesso"
              text="O agendamento foi salvo no calendário"
            />
          );
          this.setState({ loading: false });
          this.props.setActiveItem("calendar");
          this.props.history.push("/dashboard/agendamentos/calendario");
        })
        .catch(error => {
          this.setState({ loading: false });
          toast(
            <Notification
              type="error"
              title="Erro ao criar agendamento"
              text={error.response.data.msg}
            />
          );
        });
    }
  };

  componentDidMount() {
    if (this.props.start && this.props.end) {
      this.setState({
        appointment: {
          ...this.state.appointment,
          start: this.props.start,
          end: this.props.end
        },
        selectedDate: this.props.start
      });
    }
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(config.api + "/services/company", {}, requestConfig)
      .then(response => {
        this.setState({ services: response.data }, () => {
          this.setServicesDropdown(response.data);
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });

    Axios.post(config.api + "/costumers/list", {}, requestConfig)
      .then(response => {
        this.setState({ clients: response.data }, () => {
          this.setClientsDropdown(response.data);
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }
  render() {
    return (
      <div>
        <Form>
          <FormTitle text="Novo Agendamento" first />
          <Columns>
            <ServiceColumn>
              <FormSubTitle text="Serviço" first />
              <StyledFormGroup>
                <StyledDropDown
                  placeholder="Selecione um serviço..."
                  search
                  selection
                  options={this.state.servicesDropdown}
                  onChange={this.handleService}
                  fluid
                />
                <div>
                  {this.state.selectedService !== undefined && (
                    <ServiceDescWrapper>
                      <ServiceDescItemFirst>
                        <Icon name="dollar" /> R${" "}
                        {formatCurrency(this.state.selectedService.value)}
                      </ServiceDescItemFirst>
                      <div>
                        <Icon name="clock outline" />{" "}
                        {this.state.selectedService.duration} minutos
                      </div>
                    </ServiceDescWrapper>
                  )}
                </div>
              </StyledFormGroup>
              {!this.state.isSpecialist &&
                this.state.selectedService !== undefined && (
                  <>
                    <FormSubTitle text="Especialista" />
                    <StyledFormGroup>
                      <StyledDropDown
                        placeholder="Selecione um especialista..."
                        search
                        selection
                        options={this.state.specialistDropdown}
                        onChange={this.handleSpecialist}
                        fluid
                      />
                    </StyledFormGroup>
                  </>
                )}
              {!this.state.isSpecialist &&
                this.state.selectedService === undefined && (
                  <>
                    <FormSubTitle text="Especialista" />
                    <StyledSegment placeholder>
                      <Header icon>
                        <Icon name="wrench" />
                        Selecione o serviço
                      </Header>
                    </StyledSegment>
                  </>
                )}
              {this.state.calendar !== undefined && (
                <>
                  <Columns>
                    <DateColumn>
                      <FormSubTitle
                        text="Data"
                        first={this.state.isSpecialist}
                      />
                      <DatePicker
                        inline
                        selected={this.state.selectedDate}
                        onChange={this.handleDate}
                        onMonthChange={this.handleMonthChange}
                        excludeDates={this.state.calendar.dates}
                        allowSameDay={false}
                        locale="pt-BR"
                        minDate={new Date()}
                      />
                    </DateColumn>
                    <TimeColumn>
                      <FormSubTitle
                        text="Hora"
                        first={this.state.isSpecialist}
                      />
                      {this.state.timesDropdown.length > 0 && (
                        <>
                          {this.state.defaultTime && (
                            <>
                              <TimeDropDown
                                search
                                selection
                                options={this.state.timesDropdown}
                                onChange={this.handleTime}
                                defaultValue={this.state.defaultTime}
                                fluid
                              />
                            </>
                          )}
                          {!this.state.defaultTime && (
                            <>
                              <TimeDropDown
                                search
                                selection
                                options={this.state.timesDropdown}
                                onChange={this.handleTime}
                                fluid
                              />
                            </>
                          )}
                        </>
                      )}
                      {this.state.timesDropdown.length === 0 && (
                        <TimesUnavailable>
                          Não há horários disponíveis
                        </TimesUnavailable>
                      )}
                    </TimeColumn>
                  </Columns>
                </>
              )}
              {this.state.calendar === undefined && (
                <>
                  <FormSubTitle text="Data e Hora" />
                  <StyledSegment placeholder>
                    <Header icon>
                      {!this.state.isSpecialist && (
                        <>
                          <Icon name="calendar alternate outline" />
                          Selecione o especialista
                        </>
                      )}
                      {this.state.isSpecialist && (
                        <>
                          <Icon name="wrench" />
                          Selecione o serviço
                        </>
                      )}
                    </Header>
                  </StyledSegment>
                </>
              )}

              {this.state.errors.appointment.map((error, index) => (
                <ValidationError key={index} show error={error} />
              ))}
            </ServiceColumn>
            <ClientColumn>
              <FormSubTitle text="Cliente" first />

              {this.state.clientsDropdown.length > 0 && (
                <>
                  {!this.state.clientSelectedOrNew && (
                    <StyledDropDown
                      placeholder="Selecione um cliente..."
                      fluid
                      search
                      selection
                      options={this.state.clientsDropdown}
                      onChange={this.handleClient}
                    />
                  )}
                </>
              )}
              <ClientAddButtonColumn />
              {this.state.clientSelectedOrNew && (
                <Button
                  content="Novo Cliente"
                  color="blue"
                  onClick={this.handleNewClient}
                  compact
                  icon="plus"
                />
              )}
              {this.state.clientSelectedOrNew && (
                <Button
                  content="Pesquisar"
                  color="green"
                  onClick={this.handleSearchClient}
                  compact
                  icon="search"
                />
              )}

              {!this.state.clientSelectedOrNew && (
                <>
                  <StyledSegmentClient placeholder>
                    <Header icon>
                      <Icon name="user plus" />
                      Caso não esteja listado, adicione um novo cliente
                    </Header>
                    <AddClientButton
                      content="Novo Cliente"
                      color="blue"
                      onClick={this.handleNewClient}
                    />
                  </StyledSegmentClient>
                </>
              )}
              {this.state.clientSelectedOrNew && (
                <>
                  <ClientFormSpacer />
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      label="Nome"
                      placeholder="Nome"
                      required
                      value={this.state.client.firstName}
                      onChange={event => {
                        this.handleClientInput(event, "firstName", "text");
                      }}
                    />
                    <Form.Input
                      fluid
                      label="Sobrenome"
                      placeholder="Sobrenome"
                      required
                      value={this.state.client.lastName}
                      onChange={event => {
                        this.handleClientInput(event, "lastName", "text");
                      }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <div className="field">
                      <label>Sexo</label>
                    </div>

                    <Form.Field>
                      <Radio
                        label="Feminino"
                        name="gender"
                        value="F"
                        checked={this.state.client.gender === "F"}
                        onChange={(event, object) => {
                          this.handleClientInput(
                            event,
                            "gender",
                            "radio",
                            object
                          );
                        }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Masculino"
                        name="gender"
                        value="M"
                        checked={this.state.client.gender === "M"}
                        onChange={(event, object) => {
                          this.handleClientInput(
                            event,
                            "gender",
                            "radio",
                            object
                          );
                        }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Outro"
                        name="gender"
                        value="O"
                        checked={this.state.client.gender === "O"}
                        onChange={(event, object) => {
                          this.handleClientInput(
                            event,
                            "gender",
                            "radio",
                            object
                          );
                        }}
                      />
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      label="Email"
                      placeholder="Email"
                      required
                      value={this.state.client.email}
                      onChange={event => {
                        this.handleClientInput(event, "email", "text");
                      }}
                    />
                  </Form.Group>
                  <Form.Group widths="2">
                    <Form.Input
                      fluid
                      label="Telefone"
                      placeholder="Telefone"
                      required
                      value={formatBrazilianPhoneNumber(
                        this.state.client.phone
                      )}
                      onChange={event => {
                        this.handleClientInput(event, "phone", "text");
                      }}
                    />
                    <StyledCheckbox
                      toggle
                      label="WhatsApp?"
                      checked={this.state.client.whatsApp}
                      onChange={(event, object) => {
                        this.handleClientInput(
                          event,
                          "whatsApp",
                          "checkbox",
                          object
                        );
                      }}
                    />
                  </Form.Group>
                </>
              )}

              {this.state.errors.client.map((error, index) => (
                <ValidationError key={index} show error={error} />
              ))}
            </ClientColumn>
          </Columns>
          <StyledFormTitle>Anotações Sobre o Agendamento</StyledFormTitle>
          <Form.Group widths="equal">
            <Form.TextArea
              rows={5}
              value={this.state.notes}
              onChange={this.handleNotesInput}
            />
          </Form.Group>
          <StyledDivider />
          <Button
            color="green"
            icon
            labelPosition="left"
            onClick={this.createAppointment}
          >
            <Icon name="cloud" />
            Criar Agendamento
          </Button>
          {this.state.loading && (
            <Spinner
              style={{ top: "6px", left: "5px", display: "inline-block" }}
              name="circle"
              color={this.props.company.settings.colors.primaryBack}
            />
          )}
          <Button floated="right" icon labelPosition="left">
            <Icon name="delete" />
            Cancelar
          </Button>
        </Form>
        {/* <pre>{JSON.stringify(this.state.appointment, null, 2)}</pre> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAppointment);
