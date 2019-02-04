import React, { Component } from "react";
import { connect } from "react-redux";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Axios from "axios";
import Spinner from "react-spinkit";
import { toast } from "react-toastify";
import config from "../../config";
import { Table, Checkbox, Divider, Button, Icon } from "semantic-ui-react";
import { formatCurrency } from "../utils";
import Notification from "../Notification/Notification";

class Services extends Component {
  state = {
    loading: false,
    services: [],
    employee: undefined
  };

  syncServicesEmployee = () => {
    let _services = JSON.parse(JSON.stringify(this.state.services));
    _services.forEach(service => {
      service.checked = false;
      this.state.employee.services.forEach(eService => {
        if (eService === service._id) {
          service.checked = true;
        }
      });
    });

    this.setState({ services: _services });
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const _employee = JSON.parse(localStorage.getItem("employee"));

    /* Why do make a request everytime?
     - An admin could add a new service and the employee will not receive
       the update until logout/login
    */
    Axios.post(config.api + "/services/company", {}, requestConfig)
      .then(response => {
        this.setState({ services: response.data, employee: _employee }, () => {
          this.syncServicesEmployee();
        });
      })
      .catch(error => {
        toast(
          <Notification
            type="error"
            title="Não foi possível carregar os serviços"
            text="Tente novamente"
          />
        );
      });
  }

  handleServiceToggle = (e, { id, checked }) => {
    let _servicesId = [];
    let _services = JSON.parse(JSON.stringify(this.state.services));
    _services.forEach(service => {
      if (service._id === id) {
        service.checked = checked;
      }
      if (service.checked) {
        _servicesId.push(service._id);
      }
    });
    this.setState({
      services: _services,
      employee: {
        ...this.state.employee,
        services: _servicesId
      }
    });
  };
  handleEmployeeServices = () => {
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(
      config.api + "/specialists/update",
      this.state.employee,
      requestConfig
    )
      .then(response => {
        toast(
          <Notification
            type="success"
            title="Serviços atualizados"
            text="Os serviços já estão disponíveis para agendamento"
          />
        );
        this.setState({ loading: false });
      })
      .catch(error => {
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar serviços"
            text="Os serviços não puderam ser atualizados. Tente novamente."
          />
        );
        this.setState({ loading: false });
      });
  };
  render() {
    return (
      <>
        <div className="profile-services" />
        <FormTitle text="Serviços" first />
        <FormSubTitle
          text="Selecione os serviços que você presta pela empresa"
          first
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Ativar?</Table.HeaderCell>
              <Table.HeaderCell>Descrição</Table.HeaderCell>
              <Table.HeaderCell>Duração</Table.HeaderCell>
              <Table.HeaderCell>Valor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.services.map((service, index) => (
              <Table.Row key={index}>
                <Table.Cell width={1}>
                  <Checkbox
                    toggle
                    onChange={this.handleServiceToggle}
                    id={service._id}
                    checked={service.checked}
                  />
                </Table.Cell>
                <Table.Cell width={11}>{service.desc}</Table.Cell>
                <Table.Cell width={2}>{service.duration} min</Table.Cell>
                <Table.Cell width={2}>
                  R$ {formatCurrency(service.value)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {/* <pre>{JSON.stringify(this.state.services, null, 2)}</pre> */}
        {/* {this.state.employee !== undefined && (
          <pre>{JSON.stringify(this.state.employee.services, null, 2)}</pre>
        )} */}
        <Divider style={{ marginTop: "40px" }} />
        <Button
          icon
          labelPosition="left"
          color="green"
          disabled={this.state.loading}
          onClick={this.handleEmployeeServices}
        >
          <Icon name="cloud" />
          Salvar
        </Button>
        {this.state.loading && (
          <Spinner
            style={{
              top: "6px",
              left: "5px",
              display: "inline-block"
            }}
            name="circle"
            color={
              this.props.company
                ? this.props.company.settings.colors.primaryBack
                : ""
            }
          />
        )}
      </>
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
