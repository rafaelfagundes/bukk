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

  componentDidMount() {
    this.getServices();
  }

  handleServiceToggle = (index, value) => {
    const _services = JSON.parse(JSON.stringify(this.state.services));
    _services[index].checked = value;
    this.setState({ services: _services });
  };

  handleEmployeeServices = () => {
    this.setState({ loading: true });
    const _employee = JSON.parse(localStorage.getItem("employee"));
    const _servicesIds = [];
    this.state.services.map(service => {
      if (service.checked) {
        _servicesIds.push(service._id);
      }
    });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(
      config.api + "/specialists/update",
      { _id: _employee._id, services: _servicesIds },
      requestConfig
    )
      .then(response => {
        this.getServices();
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

  getServices() {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const _employee = JSON.parse(localStorage.getItem("employee"));
    Axios.post(
      config.api + "/services/employee",
      { id: _employee._id },
      requestConfig
    )
      .then(response => {
        this.setState({ services: response.data.services });
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

  render() {
    return (
      <>
        <div className="profile-services" />
        <FormTitle text="Serviços" first />
        <FormSubTitle
          text="Selecione os serviços que você presta pela empresa"
          first
        />
        <Table fixed singleLine striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>Status</Table.HeaderCell>
              <Table.HeaderCell width={11}>Descrição</Table.HeaderCell>
              <Table.HeaderCell width={2}>Duração</Table.HeaderCell>
              <Table.HeaderCell width={2}>Valor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.services.map((service, index) => (
              <Table.Row key={index}>
                <Table.Cell width={1}>
                  <Checkbox
                    toggle
                    onChange={() =>
                      this.handleServiceToggle(index, !service.checked)
                    }
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
