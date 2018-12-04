import React, { Component } from "react";
import {
  Header,
  Form,
  Button,
  Icon,
  Grid,
  Table,
  Image,
  Message
} from "semantic-ui-react";
import Specialist from "../Specialist/Specialist";
// import TimePills from "../TimePills/TimePills";
import Pill from "../TimePills/Pill";
import Spacer from "../Spacer/Spacer";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./DatePicker.css";
import "../TimePills/TimePills.css";
import axios from "axios";
import config from "../../config";
import calendarLocale from "./CalendarLocale";
import _ from "lodash";
import { connect } from "react-redux";

import {
  setCurrentService,
  setCompanyData,
  setDateTimeOk,
  setConfirmationOk,
  setAppointment
} from "../bookerActions";

const mapStateToProps = state => {
  return {
    companyData: state.booker.companyData,
    currentService: state.booker.currentService,
    appointment: state.booker.appointment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCompanyData: data => dispatch(setCompanyData(data)),
    setAppointment: appointment => dispatch(setAppointment(appointment)),
    setCurrentService: index => dispatch(setCurrentService(index)),
    setDateTimeOk: dateAndTimeOk => dispatch(setDateTimeOk(dateAndTimeOk)),
    setConfirmationOk: confirmationOk =>
      dispatch(setConfirmationOk(confirmationOk))
  };
};

function generateUUID() {
  var d = new Date().getTime();
  if (Date.now) {
    d = Date.now(); //high-precision timer
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

class DateTimePage extends Component {
  constructor(props) {
    super(props);
    moment.locale("pt-br", calendarLocale);

    this.state = {
      appointmentDate: moment(),
      appointmentTime: "",
      serviceId: "",
      services: [],
      specialistId: "",
      specialists: [],
      servicesTable: [],
      timeTable: [],
      excludeDates: [],
      saveClicked: false,
      errors: {
        companyNotFound: false
      }
    };
  }

  resetPage = () => {
    this.setState({
      appointmentDate: moment(),
      appointmentTime: "",
      specialists: [],
      serviceKey: "",
      serviceId: "",
      specialistId: "",
      saveClicked: false
    });
  };

  getSpecialist(id) {
    const index = _.findIndex(this.props.companyData.specialists, function(o) {
      return o.id === id;
    });
    if (index >= 0) {
      return this.props.companyData.specialists[index];
    } else {
      return null;
    }
  }
  getService(id) {
    const index = _.findIndex(this.props.companyData.services, function(o) {
      return o.id === id;
    });
    if (index >= 0) {
      return this.props.companyData.services[index];
    } else {
      return null;
    }
  }

  handleSave = () => {
    let _service = this.getService(this.state.serviceId);
    let _specialist = this.getSpecialist(this.state.specialistId);
    let _servicesTable = this.state.servicesTable;

    _servicesTable.push({
      serviceKey: this.state.serviceKey,
      serviceId: _service.id,
      serviceDesc: _service.desc,
      specialistName: _specialist.firstName + " " + _specialist.lastName,
      specialistImage: _specialist.image,
      dateTime:
        this.state.appointmentDate.format("DD [de] MMMM [de] YYYY") +
        " às " +
        this.state.appointmentTime
    });
    this.resetPage();
    this.setState({ saveClicked: true });
    this.props.setDateTimeOk(true);
  };

  handleDeleteService = (e, { value }) => {
    let _servicesTable = this.state.servicesTable;

    _.remove(_servicesTable, function(o) {
      return o.serviceKey === value;
    });

    _.remove(this.props.appointment.services, function(o) {
      return o.serviceKey === value;
    });

    this.props.setAppointment(this.props.appointment);
    this.props.setCurrentService(
      _servicesTable.length === 0 ? 0 : _servicesTable.length - 1
    );
    this.resetPage();
    this.setState({ servicesTable: _servicesTable, saveClicked: true });
    if (_servicesTable.length === 0) {
      this.props.setDateTimeOk(false);
    }
  };

  handleAddService = () => {
    this.resetPage();
    this.props.setCurrentService(this.props.currentService + 1);
  };

  handleMonthChange = e => {
    const _month = e.format("YYYY-MM");
    const _specialistId = this.state.specialistId;

    axios
      .get(config.api + "/appointment/dates/" + _specialistId + "/" + _month)
      .then(response => {
        this.setState({ excludeDates: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleDate = date => {
    const _date = date.format("YYYY-MM-DD");
    const _specialistId = this.state.specialistId;

    axios
      .get(config.api + "/appointment/date/" + _specialistId + "/" + _date)
      .then(response => {
        if (response.data.times) {
          let _timeTable = [];
          response.data.times.forEach(time => {
            _timeTable.push({ time, selected: false });
          });
          this.setState({ timeTable: _timeTable });
        }
      })
      .catch(err => {
        this.setState({ timeTable: [] });
      });

    this.props.appointment.services[this.props.currentService].start = date;

    this.props.setAppointment(this.props.appointment);

    this.setState({
      appointmentDate: date
    });
  };

  handleTime = e => {
    const _time = e.target.innerText;
    const _newTime = { hour: _time.split(":")[0], minute: _time.split(":")[1] };

    this.props.appointment.services[this.props.currentService].start.set(
      _newTime
    );

    this.props.appointment.services[this.props.currentService].end = moment(
      this.props.appointment.services[this.props.currentService].start
    );

    this.props.appointment.services[this.props.currentService].end.add(
      this.props.appointment.services[this.props.currentService].duration,
      "minutes"
    );

    let _timeTable = this.state.timeTable;

    _timeTable.forEach(item => {
      if (item.time === _time) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this.props.setAppointment(this.props.appointment);
    this.setState({ timeTable: _timeTable, appointmentTime: _time });
  };

  handleSpecialist = (e, value) => {
    const _date = moment().format("YYYY-MM-DD");
    const _month = moment().format("YYYY-MM");
    const _specialistId = value;

    axios
      .get(config.api + "/appointment/date/" + _specialistId + "/" + _date)
      .then(response => {
        if (response.data.times) {
          let _timeTable = [];
          response.data.times.forEach(time => {
            _timeTable.push({ time, selected: false });
          });
          this.setState({ timeTable: _timeTable });
        }
      })
      .catch(err => {
        this.setState({ timeTable: [] });
      });

    axios
      .get(config.api + "/appointment/dates/" + _specialistId + "/" + _month)
      .then(response => {
        this.setState({ excludeDates: response.data });
      })
      .catch(err => {
        console.log(err);
      });

    let _specialistsList = this.state.specialists;

    _specialistsList.forEach(element => {
      if (element.id === value) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.setState({ specialistId: value, specialists: _specialistsList });

    this.props.appointment.services[
      this.props.currentService
    ].specialistId = value;
  };

  handleService = (e, { value }) => {
    const _serviceKey = generateUUID();
    const { duration } = this.getService(value);

    const _service = {
      serviceKey: _serviceKey,
      serviceId: value,
      start: moment(),
      end: "",
      specialistId: "",
      duration: duration
    };

    // If already exists a entry, set to this entry
    if (this.props.appointment.services[this.props.currentService]) {
      this.props.appointment.services[this.props.currentService] = _service;
    } else {
      this.props.appointment.services.push(_service);
    }

    let _specialistsList = [];

    this.props.companyData.specialists.forEach(specialist => {
      const result = _.find(specialist.services, o => {
        return o === value;
      });
      if (result) {
        specialist.selected = false;
        _specialistsList.push(specialist);
      }
    });

    this.setState({
      serviceId: value,
      serviceKey: _serviceKey,
      specialists: _specialistsList,
      specialistId: ""
    });
  };

  isWeekday = date => {
    const day = date.day();
    return day !== 0 && day !== 6;
  };

  componentDidUpdate() {
    this.props.appointment.companyId = this.props.companyId;
    this.props.setAppointment(this.props.appointment);
  }

  componentDidMount() {
    axios
      .get(config.api + "/appointment/" + this.props.companyId)
      .then(response => {
        this.props.setCompanyData(response.data);
        let _services = [];
        response.data.services.forEach(element => {
          _services.push({
            text:
              element.desc +
              " - R$" +
              element.value.toFixed(2).replace(".", ","),
            value: element.id
          });
        });
        this.setState({ services: _services });
      })
      .catch(error => {
        // handle error
        this.setState({ errors: { companyNotFound: true } });
      });
  }

  render() {
    return (
      <div className={"DateTimePage " + this.props.className}>
        {this.state.errors.companyNotFound && (
          <Message
            error
            header="Identificador da empresa inválido"
            list={[
              "Entre em contato com o suporte;",
              "Ou contate o responsável pela tecnologia em sua empresa."
            ]}
          />
        )}
        {this.state.servicesTable.length >= 1 && (
          <React.Fragment>
            <Header as="h3" color="blue">
              Serviços escolhidos
            </Header>
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">
                    Serviço
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">
                    Data e Hora
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">
                    Remover?
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.servicesTable.map(row => (
                  <Table.Row key={row.serviceKey}>
                    <Table.Cell>
                      <Header as="h4" image>
                        <Image src={row.specialistImage} avatar />
                        <Header.Content>
                          {row.serviceDesc}
                          <Header.Subheader>
                            {row.specialistName}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell textAlign="center">{row.dateTime}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        compact
                        icon
                        color="red"
                        onClick={this.handleDeleteService}
                        value={row.serviceKey}
                      >
                        <Icon name="delete" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Button
              labelPosition="left"
              icon
              color="green"
              onClick={this.handleAddService}
            >
              Incluir mais um serviço
              <Icon name="plus" />
            </Button>
          </React.Fragment>
        )}

        <Form>
          {!this.state.errors.companyNotFound &&
            (this.state.servicesTable.length === 0 ||
              !this.state.saveClicked) && (
              <React.Fragment>
                {this.state.servicesTable.length > 0 && <Spacer height={40} />}
                <Header as="h3" color="blue" className="booker-title-what">
                  O que deseja fazer?
                </Header>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Dropdown
                        onChange={this.handleService}
                        placeholder="Selecione um serviço..."
                        search
                        selection
                        options={this.state.services}
                        value={this.state.serviceId}
                      />
                    </Grid.Column>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              </React.Fragment>
            )}

          {this.state.specialists.length > 0 && this.state.serviceId !== "" && (
            <React.Fragment>
              <Header as="h3" color="blue" className="booker-title-who">
                Com quem deseja fazer?
              </Header>
              <div id="Specialists">
                {this.state.specialists.map(specialist => (
                  <Specialist
                    onClick={this.handleSpecialist}
                    key={specialist.id}
                    firstName={specialist.firstName}
                    lastName={specialist.lastName}
                    image={specialist.image}
                    desc={specialist.desc}
                    value={specialist.id}
                    selected={specialist.selected}
                  />
                ))}
              </div>
            </React.Fragment>
          )}

          {this.state.specialistId !== "" && (
            <React.Fragment>
              <Header as="h3" color="blue" className="booker-title-when">
                Quando deseja fazer?
              </Header>

              <DatePicker
                inline
                selected={this.state.appointmentDate}
                onChange={this.handleDate}
                onMonthChange={this.handleMonthChange}
                allowSameDay={false}
                minDate={moment()}
                excludeDates={this.state.excludeDates}
              />
              <div className="TimePillsContainer">
                <div className="TimePills">
                  {this.state.timeTable.map(item => (
                    <Pill
                      key={item.time}
                      item={item}
                      onClick={this.handleTime}
                    />
                  ))}
                  {this.state.timeTable.length === 0 && (
                    <Message color="orange">Nenhum horário disponível</Message>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
        </Form>
        {this.state.specialistId !== "" && (
          <React.Fragment>
            <Spacer height={20} />
            <Button
              labelPosition="left"
              icon
              color="green"
              onClick={this.handleSave}
              disabled={this.state.appointmentTime === ""}
            >
              Salvar este agendamento
              <Icon name="save" />
            </Button>
            {this.state.servicesTable.length > 0 && (
              <Button
                labelPosition="left"
                icon
                color="red"
                onClick={this.handleDeleteService}
                floated="right"
              >
                Cancelar
                <Icon name="delete" />
              </Button>
            )}
          </React.Fragment>
        )}
        {this.state.servicesTable.length > 0 &&
          !this.state.saveClicked &&
          this.state.specialistId === "" && (
            <React.Fragment>
              <Spacer height={20} />
              <Button
                labelPosition="left"
                icon
                color="red"
                onClick={this.handleDeleteService}
              >
                Cancelar
                <Icon name="delete" />
              </Button>
            </React.Fragment>
          )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DateTimePage);
