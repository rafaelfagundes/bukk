import React, { Component } from "react";
import {
  Header,
  Form,
  Button,
  Icon,
  Grid,
  Table,
  Image,
  Message,
  Popup
} from "semantic-ui-react";
import Specialist from "../Specialist/Specialist";
import Pill from "../TimePills/Pill";
import Spacer from "../Spacer/Spacer";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./DatePicker.css";
import "../TimePills/TimePills.css";
import "./DateTimePage.css";
import axios from "axios";
import config from "../../config";
import calendarLocale from "./CalendarLocale";
import _ from "lodash";
import { connect } from "react-redux";
import {
  getService,
  generateUUID,
  getSpecialist,
  getElementYPosition
} from "../Utils/utils";

import {
  setCurrentService,
  setCompanyData,
  setDateTimeOk,
  setConfirmationOk,
  setAppointment,
  setServices,
  setSpecialists
} from "../bookerActions";

const mapStateToProps = state => {
  return {
    companyData: state.booker.companyData,
    services: state.booker.services,
    specialists: state.booker.specialists,
    currentService: state.booker.currentService,
    appointment: state.booker.appointment,
    isMobile: state.booker.isMobile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCompanyData: data => dispatch(setCompanyData(data)),
    setServices: data => dispatch(setServices(data)),
    setSpecialists: data => dispatch(setSpecialists(data)),
    setAppointment: appointment => dispatch(setAppointment(appointment)),
    setCurrentService: index => dispatch(setCurrentService(index)),
    setDateTimeOk: dateAndTimeOk => dispatch(setDateTimeOk(dateAndTimeOk)),
    setConfirmationOk: confirmationOk =>
      dispatch(setConfirmationOk(confirmationOk))
  };
};

class DateTimePage extends Component {
  constructor(props) {
    super(props);
    moment.locale("pt-br", calendarLocale);

    this.state = {
      appointmentDate: moment(),
      appointmentTime: "",
      serviceId: "",
      services: [],
      showHugeDropdown: true,
      specialistId: "",
      specialistIndex: -1,
      specialistSchedule: [],
      specialists: [],
      servicesTable: [],
      timeTable: [],
      excludeDates: [],
      saveClicked: false,
      errors: { companyNotFound: false },
      greetings: ""
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

  handleSave = () => {
    let _service = getService(this.state.serviceId, this.props.services);
    let _specialist = getSpecialist(
      this.state.specialistId,
      this.props.specialists
    );
    let _servicesTable = this.state.servicesTable;

    _servicesTable.push({
      serviceKey: this.state.serviceKey,
      serviceId: _service.id,
      serviceDesc: _service.desc,
      specialistName: _specialist.firstName + " " + _specialist.lastName,
      specialistImage: _specialist.avatar,
      dateTime:
        this.state.appointmentDate.format("DD [de] MMMM [de] YYYY") +
        " às " +
        this.state.appointmentTime
    });
    this.resetPage();
    this.setState({ saveClicked: true }, () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
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
    this.setState({ servicesTable: _servicesTable, saveClicked: true }, () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    if (_servicesTable.length === 0) {
      this.props.setDateTimeOk(false);
    }
  };

  handleAddService = () => {
    // Avoid counter iteration
    if (
      this.props.appointment.services[this.props.currentService] === undefined
    ) {
      return false;
    }
    this.resetPage();
    this.props.setCurrentService(this.props.currentService + 1);

    window.scrollTo({
      top: getElementYPosition("services-title") - 70,
      behavior: "smooth"
    });
  };

  handleMonthChange = e => {
    const _month = e.format("YYYY-MM");
    const _specialistId = this.state.specialistId;
    const _duration = getService(this.state.serviceId, this.props.services)
      .duration;

    axios
      .get(
        `${
          config.api
        }/specialists/schedule/${_specialistId}/date/${_month}/duration/${_duration}`
      )
      .then(response => {
        let _dates = [];
        response.data.dates.forEach(date => {
          _dates.push(moment(date));
        });
        this.setState({
          excludeDates: _dates,
          specialistSchedule: response.data.times
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleDate = date => {
    this.handleTimeTable(date.format("YYYY-MM-DD"));

    this.props.appointment.services[this.props.currentService].start = date;

    this.props.setAppointment(this.props.appointment);

    this.setState(
      {
        appointmentDate: date
      },
      () => {
        window.scrollTo({
          top: getElementYPosition("time-pool") - 100,
          behavior: "smooth"
        });
      }
    );
  };

  handleTime = e => {
    const _time = e.target.innerText;
    const _newTime = {
      hour: _time.split(":")[0],
      minute: _time.split(":")[1],
      second: "00",
      millisecond: "000"
    };

    // Already a moment object
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
    this.setState({ timeTable: _timeTable, appointmentTime: _time }, () => {
      window.scrollTo({
        top: getElementYPosition("save-button") - 100,
        behavior: "smooth"
      });
    });
  };

  handleRandom = () => {
    let _index = -2;

    do {
      _index = _.random(0, this.state.specialists.length - 1);
    } while (_index === this.state.specialistIndex);

    this.handleSpecialist(null, this.state.specialists[_index].employee._id);
    this.setState({ specialistIndex: _index });
  };

  handleSpecialist = (e, value) => {
    if (this.state.specialists.length === 1) {
      return false;
    }
    const _date = moment().format("YYYY-MM-DD");
    const _month = moment().format("YYYY-MM");
    const _specialistId = String(value);
    const _duration = getService(this.state.serviceId, this.props.services)
      .duration;

    axios
      .get(
        `${
          config.api
        }/specialists/schedule/${_specialistId}/date/${_month}/duration/${_duration}`
      )
      .then(response => {
        let _dates = [];
        response.data.dates.forEach(date => {
          _dates.push(moment(date));
        });
        this.setState(
          {
            excludeDates: _dates,
            specialistSchedule: response.data.times
          },
          () => {
            this.handleTimeTable(_date);
          }
        );
      })
      .catch(err => {
        console.log(err);
      });

    let _specialistsList = this.state.specialists;

    _specialistsList.forEach(element => {
      if (element.employee._id === _specialistId) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.setState(
      {
        specialistId: _specialistId,
        specialists: _specialistsList,
        appointmentDate: moment()
      },
      () => {
        window.scrollTo({
          top: getElementYPosition("date-title") - 100,
          behavior: "smooth"
        });
      }
    );

    this.props.appointment.services[
      this.props.currentService
    ].specialistId = value;
  };

  handleService = (e, { value }) => {
    const _serviceKey = generateUUID();
    const { duration } = getService(value, this.props.services);

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

    this.props.specialists.forEach(specialist => {
      const result = _.find(specialist.employee.services, o => {
        return o === value;
      });
      if (result) {
        specialist.selected = false;
        _specialistsList.push(specialist);
      }
    });

    if (_specialistsList.length === 1) {
      _specialistsList[0].selected = true;
      this.handleSpecialist(null, _specialistsList[0].id);
      this.setState(
        {
          serviceId: value,
          serviceKey: _serviceKey,
          specialists: _specialistsList,
          showHugeDropdown: false
        },
        () => {
          window.scrollTo({
            top: getElementYPosition("specialist-title") - 100,
            behavior: "smooth"
          });
          if (this.props.isMobile) {
            document.getElementsByClassName("Booker")[0].style.height = "150vh";
          }
        }
      );
    } else {
      _specialistsList = _.shuffle(_specialistsList);
      this.setState(
        {
          serviceId: value,
          serviceKey: _serviceKey,
          specialists: _specialistsList,
          specialistId: "",
          showHugeDropdown: false
        },
        () => {
          window.scrollTo({
            top: getElementYPosition("specialist-title") - 100,
            behavior: "smooth"
          });
          if (this.props.isMobile) {
            document.getElementsByClassName("Booker")[0].style.height = "150vh";
          }
        }
      );
    }
  };

  handleTimeTable = date => {
    let _timeTable = [];

    this.state.specialistSchedule.forEach(time => {
      // Only times from date in param
      if (time.indexOf(date) >= 0) {
        _timeTable.push({
          time: moment(time).format("HH:mm"),
          selected: false
        });
      }
    });

    if (this.props.currentService > 0) {
      let _indexes = [];
      this.props.appointment.services.forEach(service => {
        if (service.end && service.end !== "") {
          if (service.specialistId === this.state.specialistId) {
            _timeTable.forEach((item, index) => {
              let _s = moment(service.start.format("YYYY-MM-DD HH:mm:ss"));
              let _e = moment(service.end.format("YYYY-MM-DD HH:mm:ss"));
              let _i = moment(date + " " + item.time + ":00");
              if (_i.isSameOrAfter(_s) && _i.isBefore(_e)) {
                _indexes.push(index);
              }
            });
          }
        }
      });
      _.pullAt(_timeTable, _indexes);
    }

    this.setState({ timeTable: _timeTable });
  };

  setTimeTable = response => {
    let _timeTable = [];
    if (this.props.currentService > 0) {
      // Already Reserved Times
      let _alreadyReserved = [];
      this.props.appointment.services.forEach(service => {
        if (service.end && service.end !== "") {
          response.data.times.forEach(item => {
            const _momentItem = moment(service.start).set({
              hour: item.split(":")[0],
              minute: item.split(":")[1]
            });
            if (
              _momentItem.isSameOrAfter(service.start) &&
              _momentItem.isBefore(service.end)
            ) {
              _alreadyReserved.push({ time: item, selected: false });
            }
          });
        }
      });

      // All times
      response.data.times.forEach(item => {
        // If not reserved, add to timetable to show in the UI
        if (!_.find(_alreadyReserved, { time: item, selected: false })) {
          _timeTable.push({ time: item, selected: false });
        }
      });
    } else {
      response.data.times.forEach(time => {
        _timeTable.push({ time, selected: false });
      });
    }
    return _timeTable;
  };

  componentDidUpdate() {
    this.props.appointment.companyId = this.props.companyId;
    this.props.setAppointment(this.props.appointment);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const hour = moment().hour();
    if (hour >= 6 && hour < 12) {
      this.setState({ greetings: "Bom dia" });
    } else if (hour >= 12 && hour < 18) {
      this.setState({ greetings: "Boa tarde" });
    } else if (hour >= 18 && hour < 24) {
      this.setState({ greetings: "Boa noite" });
    } else {
      this.setState({ greetings: "Boa madrugada" });
    }

    axios
      .get(config.api + "/companies/" + this.props.companyId)
      .then(response => {
        this.props.setCompanyData(response.data);
      })
      .catch(error => {
        // handle error
        this.setState({ errors: { companyNotFound: true } });
      });

    axios
      .get(config.api + "/services/company/" + this.props.companyId)
      .then(response => {
        this.props.setServices(response.data);
        let _services = [];
        response.data.forEach(element => {
          _services.push({
            text:
              element.desc +
              " - R$" +
              element.value.toFixed(2).replace(".", ","),
            value: element._id
          });
        });
        this.setState({ services: _services });
      });
    axios
      .get(config.api + "/specialists/company/" + this.props.companyId)
      .then(response => {
        this.props.setSpecialists(response.data);
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
            <Header
              as="h2"
              className="booker-title-what"
              id="services-table-title"
            >
              Serviços escolhidos
            </Header>
            <Table celled padded className="chosen-services-table">
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
                    <Table.Cell
                      textAlign="center"
                      className="date-services-table"
                    >
                      {row.dateTime}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        compact
                        icon
                        color="red"
                        onClick={this.handleDeleteService}
                        value={row.serviceKey}
                        className="remove-service-btn"
                      >
                        <Icon name="delete" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Button
              className="confirmation"
              labelPosition="left"
              icon
              onClick={this.handleAddService}
            >
              {this.props.isMobile
                ? "Incluir serviço"
                : "Incluir mais um serviço"}
              <Icon name="plus" />
            </Button>
            <Popup
              trigger={
                <Icon
                  className="help-tooltip"
                  size="mini"
                  name="help"
                  circular
                />
              }
              header="Incluir mais um serviço"
              content="Caso queira agendar mais um serviço clique neste botão. Ele será agendado com quaisquer outro serviço já salvo."
              basic
            />
          </React.Fragment>
        )}

        <Form>
          {this.state.showHugeDropdown && this.state.serviceId === "" && (
            <div className="huge-service">
              {this.state.servicesTable.length > 0 && <Spacer height={40} />}
              <Header as="h2" className="booker-title-what">
                {!this.props.isMobile && (
                  <>
                    {this.state.greetings}!<br />
                  </>
                )}
                Qual serviço deseja fazer?
              </Header>

              <Grid columns={1}>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Dropdown
                      className="huge-service-dropdown"
                      onChange={this.handleService}
                      placeholder="Escolha um serviço na lista..."
                      search={!this.props.isMobile}
                      selection
                      options={this.state.services}
                      value={this.state.serviceId}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          )}
          <div id="services-title" />
          {!this.state.showHugeDropdown &&
            !this.state.errors.companyNotFound &&
            (this.state.servicesTable.length === 0 ||
              !this.state.saveClicked) && (
              <React.Fragment>
                {this.state.servicesTable.length > 0 &&
                  !this.props.isMobile && <Spacer height={40} />}
                <Header as="h3" className="booker-title-what">
                  Serviço que deseja fazer
                  <Popup
                    trigger={
                      <Icon
                        className="help-tooltip"
                        size="mini"
                        name="help"
                        circular
                      />
                    }
                    header="Serviço que deseja fazer"
                    content="Escolha um dos serviços na lista. Por enquanto escolha somente um. Após informar todos os dados deste serviço, um novo poderá ser adicionado, caso queira."
                    basic
                  />
                </Header>

                <Grid columns={1}>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Dropdown
                        onChange={this.handleService}
                        placeholder="Selecione um serviço..."
                        search={!this.props.isMobile}
                        selection
                        options={this.state.services}
                        value={this.state.serviceId}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </React.Fragment>
            )}

          {this.state.specialists.length > 0 && this.state.serviceId !== "" && (
            <React.Fragment>
              <Header
                as="h3"
                className="booker-title-who"
                id="specialist-title"
              >
                {this.state.specialists.length > 1
                  ? "Escolha um especialista"
                  : "Especialista que irá lhe atender"}
                <Popup
                  trigger={
                    <Icon
                      className="help-tooltip"
                      size="mini"
                      name="help"
                      circular
                    />
                  }
                  header="Escolha um especialista"
                  content="Escolha um dos especialistas para executar o serviço. Caso tenha somente um, já está selecionado automaticamente."
                  basic
                />
              </Header>
              <div id="Specialists">
                {this.state.specialists.length > 1 && (
                  <>
                    {true && (
                      <Specialist
                        onClick={this.handleRandom}
                        firstName="Escolher"
                        lastName="Aleatoriamente"
                        desc="Deixe o sistema decidir por você"
                        image="https://res.cloudinary.com/bukkapp/image/upload/v1545096912/Bukk/Assets/shuffle-square.png"
                        random={true}
                      />
                    )}
                  </>
                )}
                {this.state.specialists.map(specialist => (
                  <Specialist
                    onClick={this.handleSpecialist}
                    key={specialist.employee._id}
                    firstName={specialist.firstName}
                    lastName={specialist.lastName}
                    image={specialist.avatar}
                    desc={specialist.employee.title}
                    value={specialist.employee._id}
                    selected={specialist.selected}
                  />
                ))}
              </div>
            </React.Fragment>
          )}

          {this.state.specialistId !== "" && (
            <React.Fragment>
              <Header as="h3" className="booker-title-when" id="date-title">
                Dia e horário
                <Popup
                  trigger={
                    <Icon
                      className="help-tooltip"
                      size="mini"
                      name="help"
                      circular
                    />
                  }
                  header="Dia e horário"
                  content="Escolha um dia e um horário. As datas em cinza claro estão indisponíveis."
                  basic
                />
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
              <div className="TimePillsContainer" id="time-pool">
                <div className="TimePills">
                  {this.state.timeTable.map(item => (
                    <Pill
                      key={item.time}
                      item={item}
                      onClick={this.handleTime}
                    />
                  ))}
                  {this.state.timeTable.length === 0 && (
                    <Message color="orange">
                      Nenhum horário disponível. Tente o próximo dia.
                    </Message>
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
              className="confirmation"
              labelPosition="left"
              icon
              onClick={this.handleSave}
              disabled={this.state.appointmentTime === ""}
              id="save-button"
            >
              {this.props.isMobile ? "Salvar" : "Salvar este agendamento"}
              <Icon name="check circle" />
            </Button>
            <Popup
              trigger={
                <Icon
                  className="help-tooltip"
                  size="mini"
                  name="help"
                  circular
                />
              }
              header="Salvar agendamento"
              content="Salve os dados deste serviço. Após salvar, você pode prosseguir ou adicionar mais um serviço."
              basic
            />
            {this.state.servicesTable.length > 0 && (
              <React.Fragment>
                <Button
                  labelPosition="left"
                  icon
                  color="red"
                  onClick={this.handleDeleteService}
                  floated="right"
                >
                  {this.props.isMobile ? "Cancelar" : "Cancelar adição"}
                  <Icon name="delete" />
                </Button>
              </React.Fragment>
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
                {this.props.isMobile ? "Cancelar" : "Cancelar adição"}
                <Icon name="delete" />
              </Button>
              <Popup
                trigger={
                  <Icon
                    className="help-tooltip"
                    size="mini"
                    name="help"
                    circular
                  />
                }
                header="Cancelar adição"
                content="Caso tenha desistido de adicionar mais um serviço, clique neste botão."
                basic
              />
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
