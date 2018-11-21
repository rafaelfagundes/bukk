import React, { Component } from "react";
import { Header, Form, Button, Icon, Grid } from "semantic-ui-react";
import Specialist from "../Specialist/Specialist";
import TimePills from "../TimePills/TimePills";
import Spacer from "../Spacer/Spacer";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./DatePicker.css";
import axios from "axios";
import config from "../../../config";
import { connect } from "react-redux";
import { setCompanyData, setDate, setService } from "../bookerActions";

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
    setDate: appointment => dispatch(setDate(appointment)),
    setService: appointment => dispatch(setService(appointment))
  };
};

class DateTimePage extends Component {
  constructor(props) {
    super(props);
    moment.locale("pt-br", {
      months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split(
        "_"
      ),
      monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
      weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split(
        "_"
      ),
      weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
      weekdaysMin: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
      weekdaysParseExact: true,
      longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D [de] MMMM [de] YYYY",
        LLL: "D [de] MMMM [de] YYYY [às] HH:mm",
        LLLL: "dddd, D [de] MMMM [de] YYYY [às] HH:mm"
      },
      calendar: {
        sameDay: "[Hoje às] LT",
        nextDay: "[Amanhã às] LT",
        nextWeek: "dddd [às] LT",
        lastDay: "[Ontem às] LT",
        lastWeek: function() {
          return this.day() === 0 || this.day() === 6
            ? "[Último] dddd [às] LT" // Saturday + Sunday
            : "[Última] dddd [às] LT"; // Monday - Friday
        },
        sameElse: "L"
      },
      relativeTime: {
        future: "em %s",
        past: "há %s",
        s: "poucos segundos",
        ss: "%d segundos",
        m: "um minuto",
        mm: "%d minutos",
        h: "uma hora",
        hh: "%d horas",
        d: "um dia",
        dd: "%d dias",
        M: "um mês",
        MM: "%d meses",
        y: "um ano",
        yy: "%d anos"
      },
      dayOfMonthOrdinalParse: /\d{1,2}º/,
      ordinal: "%dº"
    });
    this.state = {
      appointmentDate: moment(),
      services: [],
      specialists: [],
      serviceId: "",
      specialistId: ""
    };
  }

  handleDate = date => {
    this.props.appointment.services[
      this.props.currentService
    ].dateAndTime.date = date;

    this.props.setDate(this.props.appointment);

    this.setState({
      appointmentDate: date
    });
  };

  handleSpecialist = (e, value) => {
    let _specialistsList = this.state.specialists;

    _specialistsList.forEach(element => {
      if (element.id === value) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.setState({ specialistId: value });
    this.setState({ specialists: _specialistsList });

    this.props.appointment.services[
      this.props.currentService
    ].specialistId = value;
  };

  handleService = (e, { value }) => {
    this.props.appointment.services[
      this.props.currentService
    ].serviceId = value;
    this.setState({ serviceId: value });
  };

  isWeekday = date => {
    const day = date.day();
    return day !== 0 && day !== 6;
  };

  componentDidUpdate() {
    this.props.setService(this.props.appointment);
  }

  componentDidMount() {
    axios
      .get(config.api + "/appointment/")
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

        response.data.specialists.forEach(element => {
          element.selected = false;
        });

        this.setState({ specialists: response.data.specialists });
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  }

  render() {
    return (
      <div className={"DateTimePage " + this.props.className}>
        <Form>
          <Header as="h3" color="blue" className="booker-title-what">
            O que deseja fazer?
          </Header>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Dropdown
                  onChange={this.handleService}
                  placeholder="Serviços"
                  search
                  selection
                  options={this.state.services}
                  value={this.state.serviceId}
                />
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid>

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

          <Header as="h3" color="blue" className="booker-title-when">
            Quando deseja fazer?
          </Header>

          <DatePicker
            inline
            selected={this.state.appointmentDate}
            onChange={this.handleDate}
            allowSameDay={false}
            minDate={moment()}
            excludeDates={[]}
            filterDate={this.isWeekday}
          />

          <TimePills
            startTime="8"
            endTime="18"
            minTimeFrame="15"
            excludeTimes={[
              "12:00",
              "12:15",
              "12:30",
              "12:45",
              "13:00",
              "13:15",
              "13:30",
              "13:45"
            ]}
          />
          <Spacer height="60" />

          <div className="ui one column center aligned grid">
            <Button labelPosition="left" icon color="green">
              Incluir mais um serviço
              <Icon name="plus" />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DateTimePage);
