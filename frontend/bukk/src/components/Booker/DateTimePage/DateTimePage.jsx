import React, { Component } from "react";
import { Header, Form } from "semantic-ui-react";
import Specialist from "../Specialist/Specialist";
import TimePills from "../TimePills/TimePills";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./DatePicker.css";

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
      startDate: moment().add(1, "days")
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  isWeekday = date => {
    const day = date.day();
    return day !== 0 && day !== 6;
  };

  render() {
    return (
      <div className="DateTimePage">
        <Form>
          <Header as="h3" color="blue" className="booker-title-what">
            O que deseja fazer?
          </Header>

          <Form.Dropdown
            placeholder="Serviços"
            search
            selection
            width={8}
            options={[
              {
                key: "CCM",
                value: "CCM01",
                text: "Corte de Cabelo Masculino"
              }
            ]}
          />

          <Header as="h3" color="blue" className="booker-title-when">
            Quando deseja fazer?
          </Header>

          <DatePicker
            inline
            selected={this.state.startDate}
            onChange={this.handleChange}
            allowSameDay={false}
            minDate={moment()}
            excludeDates={[moment(), moment("03/11/2018", "DD/MM/YYYY")]}
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

          <Header as="h3" color="blue" className="booker-title-who">
            Com quem deseja fazer?
          </Header>
          <div>
            <Specialist
              firstName="Andrea"
              lastName="Barbosa"
              image="http://i.pravatar.cc/150?img=49"
              desc="Hair Stylist"
              selected
            />
            <Specialist
              firstName="Carlos"
              lastName="Deodoro"
              image="http://i.pravatar.cc/300?img=50"
              desc="Barbeiro"
            />
            <Specialist
              firstName="Enzo"
              lastName="Fonseca"
              image="http://i.pravatar.cc/300?img=11"
              desc="Barbeiro"
            />
            <Specialist
              firstName="Gabriela"
              lastName="Honda"
              image="http://i.pravatar.cc/150?img=35"
              desc="Nail Stylist"
            />
            <Specialist
              firstName="Helen"
              lastName="Iolanda"
              image="http://i.pravatar.cc/150?img=45"
              desc="Nail Stylist"
            />
          </div>
        </Form>
      </div>
    );
  }
}

export default DateTimePage;
