import React, { Component } from "react";
import { connect } from "react-redux";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Axios from "axios";
import { Form, Icon } from "semantic-ui-react";
import _ from "lodash";
import styled from "styled-components";
import { formatCurrency } from "../utils";

import config from "../../config";

/* ===============================================================================
  STYLED COMPONENTES
=============================================================================== */
const StyledFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
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
    specialistDropdown: []
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

    console.log();

    this.setState({ specialistDropdown: _.sortBy(_specialists, ["text"]) });
  };

  handleService = (e, { value }) => {
    const service = _.find(this.state.services, { _id: value });

    this.setState({
      selectedService: {
        value: service.value,
        duration: service.duration
      }
    });

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
        this.setState({ specialists: response.data }, () => {
          this.setSpecialistsDropdown(response.data);
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  handleSpecialist = (e, { value }) => {
    console.log(value);
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
            <Form.Dropdown
              placeholder="Selecione o serviço"
              search
              selection
              options={this.state.servicesDropdown}
              width={8}
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
                <Form.Dropdown
                  placeholder="Selecione o especialista"
                  search
                  selection
                  options={this.state.specialistDropdown}
                  width={8}
                  onChange={this.handleSpecialist}
                />
              </StyledFormGroup>
            </>
          )}
          <FormSubTitle text="Data e Hora" />
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
