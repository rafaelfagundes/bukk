import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Checkbox, Button, Icon } from "semantic-ui-react";
import Axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";
import Notification from "../Notification/Notification";
import { setCurrentPage, setCompany } from "../dashboardActions";

export class List extends Component {
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

  handleServiceDisplay = (e, value) => {
    this.setState({ loading: true });
    const _index = Number(e.currentTarget.id.replace("display-", ""));
    let _services = JSON.parse(JSON.stringify(this.state.services));
    _services[_index].display = e.currentTarget.checked;

    this.setState(
      {
        services: _services
      },
      () => {
        const token = localStorage.getItem("token");
        let requestConfig = {
          headers: {
            Authorization: token
          }
        };

        const _data = {
          _id: value._id,
          display: !value.display
        };

        Axios.post(
          config.api + "/services/company/update",
          _data,
          requestConfig
        )
          .then(response => {
            this.setState({ loading: false });
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
      }
    );
  };

  deleteService = id => {
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(config.api + "/services/company/delete", { id }, requestConfig)
      .then(response => {
        this.setState({ loading: false });
        toast(
          <Notification
            type="success"
            title="Serviço removido com sucesso"
            text="O serviço foi removido"
          />
        );
        this.getServices();
      })
      .catch(err => {
        toast(
          <Notification
            type="error"
            title="Erro ao remover serviço da empresa"
            text={err.response.data.msg}
          />
        );
      });
  };

  componentDidMount() {
    this.getServices();

    this.props.setCurrentPage({
      title: "Serviços",
      icon: "wrench"
    });
  }
  getServices() {
    const _company = JSON.parse(localStorage.getItem("company"));
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    Axios.post(config.api + "/services/company/", _company, requestConfig)
      .then(response => {
        this.setState({ services: response.data });
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

  render() {
    return (
      <>
        <Table fixed singleLine striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>Status</Table.HeaderCell>
              <Table.HeaderCell width={9}>Descrição</Table.HeaderCell>
              <Table.HeaderCell width={2}>Duração</Table.HeaderCell>
              <Table.HeaderCell width={2}>Valor</Table.HeaderCell>
              <Table.HeaderCell width={2} />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.services.map((service, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Checkbox
                    toggle
                    checked={service.display}
                    onChange={e => this.handleServiceDisplay(e, service)}
                    id={"display-" + index}
                    disabled={this.state.loading}
                  />
                </Table.Cell>
                <Table.Cell>{service.desc}</Table.Cell>
                <Table.Cell>{service.duration} min</Table.Cell>
                <Table.Cell>R$ {this.formatCurrency(service.value)}</Table.Cell>
                <Table.Cell textAlign="right">
                  <Button
                    icon
                    id={"edit-" + index}
                    compact
                    inverted
                    color="blue"
                    onClick={() => {
                      this.props.setEdit(service._id);
                    }}
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    id={"remove-" + index}
                    compact
                    inverted
                    color="red"
                    onClick={() => {
                      this.deleteService(service._id);
                    }}
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setCompany: company => dispatch(setCompany(company))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
