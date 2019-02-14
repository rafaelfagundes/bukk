import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker, { registerLocale } from "react-datepicker";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Axios from "axios";
import { Form, Icon } from "semantic-ui-react";
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
  display: flex;
  flex-direction: column;
`;

const StyledDropDown = styled(Form.Dropdown)`
  min-width: 400px;
`;

const ServiceDescWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;

const ServiceDescItemFirst = styled.div`
  margin: 0px 15px 0 5px;
`;
/* ============================================================================ */

export class NewAppointment extends Component {
  state = {
    services: [],
    servicesDropdown: [],
    selectedService: undefined,
    specialists: [],
    specialistDropdown: [],
    selectedSpecialist: undefined,
    selectedDate: moment(),
    calendar: undefined
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
        text: `${s.firstName} ${s.lastName}`,
        image: {
          avatar: true,
          src: s.avatar
        }
      });
    });

    this.setState({ specialistDropdown: _.sortBy(_specialists, ["text"]) });
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
            selectedService: {
              value: service.value,
              duration: service.duration
            }
          },
          () => {
            this.setSpecialistsDropdown(response.data);
          }
        );
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  handleSpecialist = (e, { value }) => {
    this.setState({ selectedSpecialist: value });

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
        date: this.state.selectedDate.format("YYYY-MM"),
        duration: this.state.selectedService.duration
      },
      requestConfig
    )
      .then(response => {
        console.log(response.data);
        const { dates, times } = response.data;
        this.setState({
          calendar: {
            dates,
            times
          }
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  handleMonthChange = e => {
    console.log(moment(e).format("YYYY-MM"));

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
        console.log(response.data);
        const { dates, times } = response.data;
        this.setState({
          calendar: {
            dates,
            times
          }
        });
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
  }
  render() {
    return (
      <div>
        <Form>
          <FormTitle text="Novo Agendamento" first />
          <FormSubTitle text="Serviço" first />
          <StyledFormGroup>
            <StyledDropDown
              placeholder="Selecione o serviço"
              search
              selection
              options={this.state.servicesDropdown}
              onChange={this.handleService}
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
          {this.state.selectedService !== undefined && (
            <>
              <FormSubTitle text="Especialista" />
              <StyledFormGroup>
                <StyledDropDown
                  placeholder="Selecione o especialista"
                  search
                  selection
                  options={this.state.specialistDropdown}
                  onChange={this.handleSpecialist}
                />
              </StyledFormGroup>
            </>
          )}
          {this.state.calendar !== undefined && (
            <>
              <FormSubTitle text="Data e Hora" />
              <DatePicker
                inline
                selected={this.state.appointmentDate}
                onChange={this.handleDate}
                onMonthChange={this.handleMonthChange}
                allowSameDay={false}
                minDate={new Date()}
                excludeDates={this.state.calendar.dates}
                locale="pt-BR"
              />
            </>
          )}

          <FormSubTitle text="Cliente" />
        </Form>
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
