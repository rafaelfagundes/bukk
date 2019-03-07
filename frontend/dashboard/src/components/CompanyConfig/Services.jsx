import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
import Axios from "axios";
import { toast } from "react-toastify";
import { isNumeric } from "../validation";
import {
  Icon,
  Table,
  Checkbox,
  Input,
  Button,
  Divider
} from "semantic-ui-react";
import config from "../../config";
import Notification from "../Notification/Notification";
import FormTitle from "../Common/FormTitle";
import ValidationError from "../Common/ValidationError";
import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const ServicesError = styled.div`
  margin: 15px 0 0px 0;
`;

const ServiceInput = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 38px;
`;

const ServiceDescInput = styled(Input)`
  width: 100%;
`;

const ServiceDurationInput = styled(Input)`
  width: calc(100% - 40px);
  margin-right: 5px;
`;

const ServiceValueInput = styled(Input)`
  width: calc(100% - 35px);
  margin-left: 5px;
`;

/* ============================================================================ */

export class Services extends Component {
  state = {
    loading: false,
    newAdded: false,
    services: [],
    errors: []
  };

  formatCurrency = value => {
    return String(value)
      .replace(/[^\d.,-]/g, "")
      .replace(".", ",");
  };

  formatCurrencyOnBlur = e => {
    const _value = parseFloat(e.currentTarget.value.replace(",", ".")).toFixed(
      2
    );
    const [_key, _index] = e.currentTarget.id.split("-");
    let _services = JSON.parse(JSON.stringify(this.state.services));

    _services[_index][_key] = parseFloat(_value).toFixed(2);

    this.setState({
      services: _services
    });
  };

  handleServiceValue = e => {
    const [_key, _index] = e.currentTarget.id.split("-");

    let _value = e.currentTarget.value;
    let _services = JSON.parse(JSON.stringify(this.state.services));

    if (_key === "duration") {
      _services[_index][_key] = _value.replace(/\D/g, "");
    } else {
      _services[_index][_key] = _value;
    }

    this.setState({
      services: _services
    });
  };

  handleServiceDisplay = e => {
    const _index = Number(e.currentTarget.id.replace("display-", ""));
    let _services = JSON.parse(JSON.stringify(this.state.services));
    _services[_index].display = e.currentTarget.checked;

    this.setState({
      services: _services
    });
  };

  handleAddService = e => {
    e.preventDefault();
    this.setState({
      newAdded: true,
      services: [
        ...this.state.services,
        {
          display: true,
          desc: "",
          value: 0.0,
          duration: 15
        }
      ]
    });
  };

  handleRemoveService = e => {
    e.preventDefault();
    const _index = e.currentTarget.id.replace("remove-", "");

    let _services = JSON.parse(JSON.stringify(this.state.services));

    _services.splice(_index, 1);

    this.setState({
      services: _services
    });
  };

  validate = () => {
    let _errorsCount = 0;
    let _errors = [];
    let _services = JSON.parse(JSON.stringify(this.state.services));

    _services.forEach((s, index) => {
      if (s.desc !== "" && s.duration !== "" && s.value !== "") {
        if (!isNumeric(s.duration)) {
          _errors.push({
            msg: `[Campo ${index + 1}] Campo duração inválido.`,
            error: true
          });
        }
        if (!isNumeric(s.value)) {
          _errors.push({
            msg: `[Campo ${index + 1}] Campo valor inválido.`,
            error: true
          });
        }
      } else {
        _errorsCount++;
        _errors.push({
          msg: `[Campo ${index +
            1}] Por favor preencha todos os campos, ou remova o serviço.`,
          error: true
        });
      }
    });

    this.setState({
      errors: _errors
    });

    if (_errorsCount) {
      return false;
    } else {
      return true;
    }
  };

  saveServices = e => {
    e.preventDefault();
    if (!this.validate()) {
      return false;
    }
    const _company = JSON.parse(localStorage.getItem("company"));
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    let _services = [];
    this.state.services.forEach(s => {
      s.duration = Number(s.duration);
      s.value = Number(s.value);
      _services.push(s);
    });

    const _data = {
      services: _services,
      companyId: _company._id
    };

    Axios.post(config.api + "/services/company/update", _data, requestConfig)
      .then(response => {
        localStorage.setItem(
          "services",
          JSON.stringify(response.data.services)
        );
        toast(
          <Notification
            type="success"
            title="Serviços atualizados com sucesso"
            text="Os serviços já estão prontos para serem exibidos"
          />
        );
      })
      .catch(err => {
        toast(
          <Notification
            type="error"
            title="Erro ao carregar os serviços da empresa"
            text={err.response.data.msg}
          />
        );
      });
  };

  componentDidMount() {
    const _company = JSON.parse(localStorage.getItem("company"));
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    if (localStorage.getItem("services")) {
      this.setState({ services: JSON.parse(localStorage.getItem("services")) });
    } else {
      Axios.post(config.api + "/services/company/", _company, requestConfig)
        .then(response => {
          this.setState({ services: response.data });
          localStorage.setItem("services", JSON.stringify(response.data));
        })
        .catch(err => {
          toast(
            <Notification
              type="error"
              title="Erro ao carregar os serviços da empresa"
              text={err.response.data.msg}
            />
          );
        });
    }
  }

  render() {
    return (
      <div>
        <FormTitle text="Serviços" first />
        <Table fixed singleLine striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>Status</Table.HeaderCell>
              <Table.HeaderCell width={9}>Descrição</Table.HeaderCell>
              <Table.HeaderCell width={2}>Duração</Table.HeaderCell>
              <Table.HeaderCell width={2}>Valor</Table.HeaderCell>
              <Table.HeaderCell width={1} />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.services.map((service, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Checkbox
                    toggle
                    checked={service.display}
                    onChange={this.handleServiceDisplay}
                    id={"display-" + index}
                  />
                </Table.Cell>
                <Table.Cell>
                  {!this.state.newAdded && (
                    <ServiceInput>
                      {this.state.errors.length > 0 && (
                        <div className="company-config-service-label">
                          {index + 1}
                          {"-"}
                        </div>
                      )}
                      <ServiceDescInput
                        className="company-config-service-desc"
                        value={service.desc}
                        onChange={this.handleServiceValue}
                        id={"desc-" + index}
                      />
                    </ServiceInput>
                  )}
                  {this.state.newAdded && (
                    <ServiceInput>
                      {this.state.errors.length > 0 && (
                        <div className="company-config-service-label">
                          {index + 1}
                          {"-"}
                        </div>
                      )}
                      <ServiceDescInput
                        className="company-config-service-desc"
                        value={service.desc}
                        onChange={this.handleServiceValue}
                        id={"desc-" + index}
                        autoFocus
                      />
                    </ServiceInput>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <ServiceInput>
                    <ServiceDurationInput
                      className="company-config-service-duration"
                      value={service.duration}
                      onChange={this.handleServiceValue}
                      id={"duration-" + index}
                    />
                    <div className="company-config-service-label">min</div>
                  </ServiceInput>
                </Table.Cell>
                <Table.Cell>
                  <ServiceInput>
                    <div className="company-config-service-label">R$</div>
                    <ServiceValueInput
                      className="company-config-service-value"
                      value={this.formatCurrency(service.value)}
                      onChange={this.handleServiceValue}
                      onBlur={this.formatCurrencyOnBlur}
                      id={"value-" + index}
                    />
                  </ServiceInput>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button
                    icon
                    onClick={this.handleRemoveService}
                    id={"remove-" + index}
                    compact
                    inverted
                    color="red"
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Button
          icon="plus"
          content="Adicionar Serviço"
          onClick={this.handleAddService}
          compact
          color="blue"
        />
        <ServicesError>
          {this.state.errors.map((error, index) => (
            <ValidationError key={index} show={error.error} error={error.msg} />
          ))}
        </ServicesError>
        {/* <pre>{JSON.stringify(this.state.services, null, 2)}</pre> */}
        <Divider style={{ marginTop: "40px" }} />
        <Button
          icon
          labelPosition="left"
          color="green"
          onClick={this.saveServices}
        >
          <Icon name="cloud" />
          Salvar
        </Button>
        {this.state.loading && (
          <Spinner
            style={{ top: "6px", left: "5px", display: "inline-block" }}
            name="circle"
            color={this.props.company.settings.colors.primaryBack}
          />
        )}
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
)(Services);
