import React, { Component } from "react";
import { connect } from "react-redux";
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
  Radio
} from "semantic-ui-react";
import _ from "lodash";
import styled from "styled-components";
import { formatCurrency } from "../utils";
import moment from "moment";
import config from "../../config";

import ptBR from "date-fns/locale/pt";

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
  margin-left: 40px;
`;

const TimesUnavailable = styled.div`
  font-weight: 400;
  font-style: italic;
  opacity: 0.8;
`;

const ClientSearchColumn = styled.div`
  width: 75%;
`;

const ClientAddButtonColumn = styled.div`
  width: 21%;
`;

const OrColumn = styled.div`
  width: 5%;
  text-align: center;
  line-height: 38px;
  font-weight: 700;
  opacity: 0.8;
`;

const AddClientButton = styled(Button)`
  height: 38px;
`;

const ClientFormSpacer = styled.div`
  height: 40px;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-top: 30px;
  margin-left: 10px;
`;

const StyledDivider = styled(Divider)`
  margin-top: 40px;
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

    console.log(JSON.parse(localStorage.getItem("employee")));

    const _company = JSON.parse(localStorage.getItem("company"))._id;
    const _user = JSON.parse(localStorage.getItem("user"))._id;

    let _employee = undefined;
    let _isSpecialist = false;

    if (localStorage.getItem("employee")) {
      _employee = JSON.parse(localStorage.getItem("employee"))._id;
      _isSpecialist = true;
    }

    this.state = {
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
      notes: ""
    };
  }

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

    this.setState({ selectedClient: _client, client: _clientState });
    this.setAppointment({ client: _client._id });

    this.toggleClientForm(true);
  };

  handleNewClient = e => {
    e.preventDefault();
    this.toggleClientForm(true);
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
        text: `${c.firstName} ${c.lastName}`
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

    this.setState({ timesDropdown: _times });
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
    console.log(e, value);
    this.setState({ selectedSpecialist: value, calendar: undefined });

    const employee = this.getEmployee(value);

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/specialists/schedule",
      {
        userId: value,
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
            },
            selectedDate: new Date()
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
      this.setAppointment({ start: e });
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

  componentDidMount() {
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
        console.log(response.data);
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
                        <TimeDropDown
                          search
                          selection
                          options={this.state.timesDropdown}
                          onChange={this.handleTime}
                          fluid
                        />
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
              <FormSubTitle text="Outras Informações" />
              <Form.Group widths="equal">
                <Form.TextArea
                  label="Anotações"
                  rows={5}
                  value={this.state.notes}
                />
              </Form.Group>
            </ServiceColumn>
            <ClientColumn>
              <FormSubTitle text="Cliente" first />
              <Columns>
                <ClientAddButtonColumn>
                  <AddClientButton
                    content="Novo"
                    icon="add"
                    labelPosition="left"
                    onClick={this.handleNewClient}
                  />
                </ClientAddButtonColumn>
                {this.state.clientsDropdown.length > 0 && (
                  <>
                    <OrColumn>ou</OrColumn>
                    <ClientSearchColumn>
                      <Form.Dropdown
                        placeholder="Selecione um cliente..."
                        fluid
                        search
                        selection
                        options={this.state.clientsDropdown}
                        onChange={this.handleClient}
                      />
                    </ClientSearchColumn>
                  </>
                )}
              </Columns>
              <ClientFormSpacer />
              {this.state.clientSelectedOrNew && (
                <>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      label="Nome"
                      placeholder="Nome"
                      required
                      value={this.state.client.firstName}
                    />
                    <Form.Input
                      fluid
                      label="Sobrenome"
                      placeholder="Sobrenome"
                      required
                      value={this.state.client.lastName}
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
                        onChange={this.handleClientGender}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Masculino"
                        name="gender"
                        value="M"
                        checked={this.state.client.gender === "M"}
                        onChange={this.handleClientGender}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Outro"
                        name="gender"
                        value="O"
                        checked={this.state.client.gender === "O"}
                        onChange={this.handleClientGender}
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
                    />
                  </Form.Group>
                  <Form.Group widths="2">
                    <Form.Input
                      fluid
                      label="Telefone"
                      placeholder="Telefone"
                      required
                      value={this.state.client.phone}
                    />
                    <StyledCheckbox
                      toggle
                      label="WhatsApp?"
                      checked={this.state.client.whatsApp}
                    />
                  </Form.Group>
                </>
              )}
            </ClientColumn>
          </Columns>
          <StyledDivider />
          <Button color="green" icon labelPosition="left">
            <Icon name="cloud" />
            Criar Agendamento
          </Button>
          <Button floated="right" icon labelPosition="left">
            <Icon name="delete" />
            Cancelar
          </Button>
        </Form>
        <pre>{JSON.stringify(this.state.appointment, null, 2)}</pre>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAppointment);
