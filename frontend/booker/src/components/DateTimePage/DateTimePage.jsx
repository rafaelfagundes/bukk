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
      specialistIndex: -1,
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

    this.handleTimeTable(_specialistId, _date);

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

  handleRandom = () => {
    let _index = -2;

    do {
      _index = _.random(0, this.state.specialists.length - 1);
    } while (_index === this.state.specialistIndex);

    this.handleSpecialist(null, this.state.specialists[_index].id);
    this.setState({ specialistIndex: _index });
  };

  handleSpecialist = (e, value) => {
    if (this.state.specialists.length === 1) {
      return false;
    }
    const _date = moment().format("YYYY-MM-DD");
    const _month = moment().format("YYYY-MM");
    const _specialistId = String(value);

    axios
      .get(config.api + "/appointment/dates/" + _specialistId + "/" + _month)
      .then(response => {
        this.setState({ excludeDates: response.data });
      })
      .catch(err => {
        console.log(err);
      });

    this.handleTimeTable(_specialistId, _date);

    let _specialistsList = this.state.specialists;

    _specialistsList.forEach(element => {
      if (element.id === _specialistId) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.setState({
      specialistId: _specialistId,
      specialists: _specialistsList,
      appointmentDate: moment()
    });

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

    if (_specialistsList.length === 1) {
      _specialistsList[0].selected = true;
      this.handleSpecialist(null, _specialistsList[0].id);
      this.setState({
        serviceId: value,
        serviceKey: _serviceKey,
        specialists: _specialistsList
      });
    } else {
      _specialistsList = _.shuffle(_specialistsList);
      this.setState({
        serviceId: value,
        serviceKey: _serviceKey,
        specialists: _specialistsList,
        specialistId: ""
      });
    }
  };

  isWeekday = date => {
    const day = date.day();
    return day !== 0 && day !== 6;
  };

  handleTimeTable = (specialistId, date) => {
    axios
      .get(config.api + "/appointment/date/" + specialistId + "/" + date)
      .then(response => {
        if (response.data) {
          let _timeTable = [];
          if (this.props.currentService > 0) {
            // Already Reserved Times
            let _alreadyReserved = [];
            this.props.appointment.services.forEach(service => {
              if (service.end && service.end !== "") {
                response.data.forEach(item => {
                  const _momentItem = moment(date).set({
                    hour: item.split(":")[0],
                    minute: item.split(":")[1],
                    second: "00"
                  });

                  if (_momentItem.isSame(service.start, "day")) {
                    if (
                      _momentItem.isSameOrAfter(
                        service.start.set({ second: "00" }),
                        "hour"
                      ) &&
                      _momentItem.isBefore(
                        service.end.set({ second: "00" }),
                        "hour"
                      )
                    ) {
                      _alreadyReserved.push({ time: item, selected: false });
                    }
                  }
                });
              }
            });

            // All times
            response.data.forEach(item => {
              // If not reserved, add to timetable to show in the UI
              if (!_.find(_alreadyReserved, { time: item, selected: false })) {
                _timeTable.push({ time: item, selected: false });
              }
            });
            this.setState({ timeTable: _timeTable });
          } else {
            response.data.forEach(time => {
              _timeTable.push({ time, selected: false });
            });
            this.setState({ timeTable: _timeTable });
          }
        }
      })
      .catch(err => {
        this.setState({ timeTable: [] });
      });
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
            <Popup
              trigger={
                <Icon
                  className="help-tooltip"
                  size="mini"
                  name="help"
                  circular
                  color="blue"
                />
              }
              header="Incluir mais um serviço"
              content="Caso queira agendar mais um serviço clique neste botão. Ele será agendado com quaisquer outro serviço já salvo."
              basic
            />
          </React.Fragment>
        )}

        <Form>
          {!this.state.errors.companyNotFound &&
            (this.state.servicesTable.length === 0 ||
              !this.state.saveClicked) && (
              <React.Fragment>
                {this.state.servicesTable.length > 0 && <Spacer height={40} />}
                <Header as="h3" color="blue" className="booker-title-what">
                  Serviço que deseja fazer
                  <Popup
                    trigger={
                      <Icon
                        className="help-tooltip"
                        size="mini"
                        name="help"
                        circular
                        color="blue"
                      />
                    }
                    header="Serviço que deseja fazer"
                    content="Escolha um dos serviços na lista. Por enquanto escolha somente um. Após informar todos os dados deste serviço, um novo poderá ser adicionado, caso queira."
                    basic
                  />
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
                      color="blue"
                    />
                  }
                  header="Escolha um especialista"
                  content="Escolha um dos especialistas para executar o serviço. Caso tenha somente um, já está selecionado automaticamente."
                  basic
                />
              </Header>
              <div id="Specialists">
                {this.state.specialists.length > 1 && (
                  <Specialist
                    onClick={this.handleRandom}
                    firstName="Escolher"
                    lastName="Aleatoriamente"
                    desc="Deixe o sistema decidir por você"
                    image="https://res.cloudinary.com/bukkapp/image/upload/v1544067728/Bukk/Assets/shuffle.png"
                    random={true}
                  />
                )}
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
                Dia e horário
                <Popup
                  trigger={
                    <Icon
                      className="help-tooltip"
                      size="mini"
                      name="help"
                      circular
                      color="blue"
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
              labelPosition="left"
              icon
              color="green"
              onClick={this.handleSave}
              disabled={this.state.appointmentTime === ""}
            >
              Salvar este agendamento
              <Icon name="save" />
            </Button>
            <Popup
              trigger={
                <Icon
                  className="help-tooltip"
                  size="mini"
                  name="help"
                  circular
                  color="blue"
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
                  Cancelar adição
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
                Cancelar adição
                <Icon name="delete" />
              </Button>
              <Popup
                trigger={
                  <Icon
                    className="help-tooltip"
                    size="mini"
                    name="help"
                    circular
                    color="blue"
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
