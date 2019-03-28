import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { setCurrentPage } from "../dashboardActions";
import FormTitle from "../Common/FormTitle";
import calendarLocale from "../../config/CalendarLocale";
import moment from "moment";
import { Icon } from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";
import config from "../../config";
import Axios from "axios";
import { Statistics } from "../Statistics/Statistics";
moment.defineLocale("pt-br", calendarLocale);

/* ===============================================================================
  COMPONENTS
=============================================================================== */
const Appointment = props => (
  <StyledAppointment to={`/dashboard/agendamento/id/${props.id}`}>
    <span>{props.service}</span>
    <span>
      <span>
        <Icon name="user" />
        {props.client}
      </span>
      <span>
        <Icon name="doctor" />
        {props.specialist}
      </span>
    </span>
    <span>
      <Icon name="clock outline" />
      {moment(props.start).format("ddd, DD[ de ]MMMM[ de ]YYYY[ | ]HH:mm")}
      {" às "}
      {moment(props.end).format("HH:mm")}
    </span>
  </StyledAppointment>
);

const Client = props => (
  <StyledClient to={`/dashboard/cliente/id/${props.id}`}>
    <span>{props.client}</span>
    <span>
      <span>
        <Icon name="mail" />
        {props.email}
      </span>
      <span>
        <Icon name="phone" />
        {formatBrazilianPhoneNumber(props.phone)}
      </span>
    </span>
    <span>
      <Icon name="clock outline" />
      {moment(props.date).format("ddd, DD[ de ]MMMM[ de ]YYYY[ às ]HH:mm")}
    </span>
  </StyledClient>
);
/* ============================================================================ */

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const TwoColumns = styled.div`
  display: flex;
  flex-direction: row;
  > div {
    width: 50%;
  }

  > div:first-child {
    margin-right: 20px;
  }
  > div:last-child {
    margin-left: 20px;
  }
`;

const StyledAppointment = styled(Link)`
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
  cursor: pointer !important;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  opacity: 0.8;
  color: #222;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0px !important;
  }
  &:hover {
    opacity: 1;
  }

  > span:nth-child(1) {
    font-size: 1.1rem;
    line-height: 1.5rem;
    font-weight: 300;
  }
  > span:nth-child(2) {
    line-height: 1.5rem;
  }
  > span:nth-child(2) > span:nth-child(1) {
    margin-right: 10px;
  }
  > span:nth-child(3) {
    line-height: 1.5rem;
  }
  > span:nth-child(4) {
    line-height: 1.5rem;
  }
`;

const StyledClient = styled(Link)`
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
  cursor: pointer !important;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  opacity: 0.8;
  color: #222;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0px !important;
  }
  &:hover {
    opacity: 1;
  }

  > span:nth-child(1) {
    font-size: 1.1rem;
    line-height: 1.5rem;
    font-weight: 300;
  }
  > span:nth-child(2) {
    line-height: 1.5rem;
  }
  > span:nth-child(2) > span:nth-child(1) {
    margin-right: 10px;
  }
  > span:nth-child(3) {
    line-height: 1.5rem;
  }
  > span:nth-child(4) {
    line-height: 1.5rem;
  }
`;

/* ============================================================================ */

export class Overview extends Component {
  state = {
    alreadyUpdated: false,
    clients: [],

    graphData: [
      {
        value: 31
      },
      {
        value: 48
      },
      {
        value: 37
      },
      {
        value: 45
      },
      {
        value: 27
      },
      {
        value: 61
      },
      {
        value: 75
      }
    ],

    stats: [],
    appointments: []
  };

  componentDidMount() {
    if (this.props.company) {
      this.props.setCurrentPage({
        icon: "home",
        title: this.props.company.companyNickname
      });
      this.setState({ alreadyUpdated: true });
    }

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(config.api + "/utils/overview", {}, requestConfig)
      .then(response => {
        const {
          appointments,
          clients,
          today,
          week,
          month,
          monthPayed
        } = response.data;

        const _stats = [
          {
            prefix: "",
            suffix: "",
            label: "Hoje",
            value: today.count,
            type: "number",
            color: "blue"
          },
          {
            prefix: "",
            suffix: "",
            label: "Semana",
            value: week.count,
            type: "number",
            color: "violet"
          },
          {
            prefix: "",
            suffix: "",
            label: "Mês",
            value: month.count,
            type: "number",
            color: "purple"
          },
          {
            prefix: "R$",
            suffix: "",
            label: "Faturamento / Mês",
            value: monthPayed.value,
            type: "currency",
            color: "teal"
          },
          {
            prefix: "R$",
            suffix: "",
            label: "Estimativa / Mês",
            value: month.value,
            type: "currency",
            color: "green"
          }
        ];
        this.setState({ appointments, clients, stats: _stats });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidUpdate() {
    if (!this.state.alreadyUpdated && this.props.company) {
      this.props.setCurrentPage({
        icon: "home",
        title: this.props.company.companyNickname
      });
      this.setState({ alreadyUpdated: true });
    }
  }
  render() {
    return (
      <>
        <FormTitle text="Agendamentos" first />
        <Statistics stats={this.state.stats} />
        <TwoColumns>
          <div>
            <FormTitle text="Próximos Agendamentos" />
            {this.state.appointments.map((app, index) => (
              <React.Fragment key={index}>
                <Appointment
                  id={app.id}
                  service={app.service}
                  specialist={app.specialist}
                  client={app.client}
                  start={app.start}
                  end={app.end}
                />
              </React.Fragment>
            ))}
          </div>
          <div>
            <FormTitle text="Novos Clientes" />
            {this.state.clients.map((client, index) => (
              <React.Fragment key={index}>
                <Client
                  id={client._id}
                  email={client.email}
                  phone={client.phone[0].number}
                  client={client.fullName}
                  date={client.createdAt}
                />
              </React.Fragment>
            ))}
          </div>
        </TwoColumns>
        {/* <FormTitle text="Atalhos" /> */}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company,
    currentPage: state.dashboard.currentPage,
    user: state.dashboard.user
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
)(Overview);
